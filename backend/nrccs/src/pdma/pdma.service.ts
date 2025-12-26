import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { User } from '../common/entities/user.entity';
import { District } from '../common/entities/district.entity';
import { Province } from '../common/entities/province.entity';
import { Shelter, ShelterStatus } from '../common/entities/shelter.entity';
import { Alert, AlertStatus, AlertSeverity } from '../common/entities/alert.entity';
import { Resource, ResourceStatus } from '../common/entities/resource.entity';
import { SosRequest, SosStatus } from '../common/entities/sos-request.entity';
import { RescueTeam, RescueTeamStatus } from '../common/entities/rescue-team.entity';
import { ActivityLog } from '../common/entities/activity-log.entity';
import { CreateShelterDto, UpdateShelterDto } from './dtos/shelter.dto';
import { CreateAlertDto, UpdateAlertDto } from './dtos/alert.dto';
import { CreateResourceDto, UpdateResourceDto, AllocateResourceDto } from './dtos/resource.dto';
import { AssignTeamDto } from './dtos/sos.dto';
import { CreateResourceRequestDto } from './dtos/resource-request.dto';
import { ResourceRequest, ResourceRequestStatus, ResourceRequestPriority } from '../common/entities/resource-request.entity';

@Injectable()
export class PdmaService {
  constructor(
    @InjectRepository(District)
    private districtRepository: Repository<District>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
    @InjectRepository(Shelter)
    private shelterRepository: Repository<Shelter>,
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    @InjectRepository(Resource)
    private resourceRepository: Repository<Resource>,
    @InjectRepository(SosRequest)
    private sosRepository: Repository<SosRequest>,
    @InjectRepository(RescueTeam)
    private rescueTeamRepository: Repository<RescueTeam>,
    @InjectRepository(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>,
    @InjectRepository(ResourceRequest)
    private resourceRequestRepository: Repository<ResourceRequest>,
  ) { }

  // ==================== HELPER METHODS ====================

  /**
   * Get all district IDs for the user's province
   */
  private async getProvinceDistrictIds(provinceId: number): Promise<number[]> {
    const districts = await this.districtRepository.find({
      where: { provinceId },
      select: ['id'],
    });
    return districts.map(d => d.id);
  }

  /**
   * Verify district belongs to user's province
   */
  private async verifyDistrictAccess(districtId: number, provinceId: number): Promise<void> {
    const district = await this.districtRepository.findOne({
      where: { id: districtId },
      select: ['id', 'provinceId'],
    });

    if (!district) {
      throw new NotFoundException(`District with ID ${districtId} not found`);
    }

    if (district.provinceId !== provinceId) {
      throw new ForbiddenException('You do not have access to this district');
    }
  }

  /**
   * Log activity
   */
  private async logActivity(
    activityType: string,
    title: string,
    description: string,
    userId: number,
    provinceId?: number,
    districtId?: number,
  ): Promise<void> {
    await this.activityLogRepository.save({
      activityType,
      title,
      description,
      performedBy: userId,
      provinceId,
      districtId,
    });
  }

  // ==================== DASHBOARD STATS ====================

  async getDashboardStats(user: User) {
    const districtIds = await this.getProvinceDistrictIds(user.provinceId);

    // If no districts, return zeros
    if (districtIds.length === 0) {
      return {
        pendingSOS: 0,
        activeShelters: 0,
        shelterCapacity: 0,
        activeTeams: 0,
        localResources: 0,
        damageReports: 0,
      };
    }

    const [
      pendingSOS,
      activeShelters,
      shelterCapacity,
      activeTeams,
      localResources,
      damageReports
    ] = await Promise.all([
      // Pending SOS requests
      this.sosRepository.count({
        where: {
          districtId: In(districtIds),
          status: In(['Pending', 'Assigned', 'En-route', 'In Progress']),
          isDeleted: false,
        },
      }),
      // Active shelters
      this.shelterRepository.count({
        where: {
          districtId: In(districtIds),
          status: In(['available', 'limited', 'operational']),
          isDeleted: false,
        },
      }),
      // Total shelter capacity
      this.shelterRepository
        .createQueryBuilder('shelter')
        .select('COALESCE(SUM(shelter.occupancy), 0)', 'total')
        .where('shelter.district_id IN (:...districtIds)', { districtIds })
        .andWhere('shelter.is_deleted = false')
        .getRawOne()
        .then(r => parseInt(r?.total, 10) || 0),
      // Active rescue teams
      this.rescueTeamRepository.count({
        where: {
          districtId: In(districtIds),
          status: In(['available', 'deployed', 'on-mission']),
          isDeleted: false,
        },
      }),
      // Local resources count
      this.resourceRepository.count({
        where: {
          provinceId: user.provinceId,
        },
      }),
      // Damage reports count (would need damage_reports entity - for now returning 0)
      Promise.resolve(0),
    ]);

    return {
      pendingSOS,
      activeShelters,
      shelterCapacity,
      activeTeams,
      localResources,
      damageReports,
    };
  }

  // ==================== DISTRICTS ====================

  async getAllDistricts(user: User) {
    return await this.districtRepository.find({
      where: { provinceId: user.provinceId },
      order: { name: 'ASC' },
    });
  }

  async getDistrictById(id: number, user: User) {
    await this.verifyDistrictAccess(id, user.provinceId);

    const district = await this.districtRepository.findOne({
      where: { id },
    });

    if (!district) {
      throw new NotFoundException(`District with ID ${id} not found`);
    }

    return district;
  }

  async getDistrictStats(id: number, user: User) {
    await this.verifyDistrictAccess(id, user.provinceId);

    const [pendingSOS, activeSOS, shelters, peopleInShelters, availableTeams] = await Promise.all([
      this.sosRepository.count({
        where: { districtId: id, status: SosStatus.PENDING, isDeleted: false },
      }),
      this.sosRepository.count({
        where: { districtId: id, status: In([SosStatus.PENDING, SosStatus.ASSIGNED, SosStatus.EN_ROUTE, SosStatus.IN_PROGRESS]), isDeleted: false },
      }),
      this.shelterRepository.count({
        where: { districtId: id, isDeleted: false },
      }),
      this.shelterRepository
        .createQueryBuilder('shelter')
        .select('COALESCE(SUM(shelter.occupancy), 0)', 'total')
        .where('shelter.district_id = :id', { id })
        .andWhere('shelter.is_deleted = false')
        .getRawOne()
        .then(r => parseInt(r.total)),
      this.rescueTeamRepository.count({
        where: { districtId: id, status: RescueTeamStatus.AVAILABLE, isDeleted: false },
      }),
    ]);

    return {
      districtId: id,
      pendingSOS,
      activeSOS,
      totalShelters: shelters,
      peopleInShelters,
      availableTeams,
    };
  }

  // ==================== ALERTS ====================

  async getAllAlerts(user: User, status?: string, severity?: string) {
    const where: any = {
      provinceId: user.provinceId,
    };

    if (status) {
      where.status = status;
    }

    if (severity) {
      where.severity = severity;
    }

    return await this.alertRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async createAlert(createAlertDto: CreateAlertDto, user: User) {
    const { districtIds, ...alertData } = createAlertDto;

    // Build alert data with defaults
    const alertDataWithDefaults: Partial<Alert> = {
      title: alertData.title,
      type: alertData.type,
      alertType: alertData.alertType,
      severity: alertData.severity || AlertSeverity.MEDIUM,
      description: alertData.description,
      message: alertData.message,
      affectedAreas: alertData.affectedAreas,
      districtId: alertData.districtId,
      province: alertData.province,
      district: alertData.district,
      provinceId: user.provinceId,
      issuedBy: user.name,
      issuedByUserId: user.id,
      status: AlertStatus.ACTIVE,
    };

    const alert = this.alertRepository.create(alertDataWithDefaults);
    const savedAlert = await this.alertRepository.save(alert);

    await this.logActivity(
      'alert_created',
      'Provincial Alert Created',
      `${user.name} created alert: ${savedAlert.title}`,
      user.id,
      user.provinceId,
    );

    return savedAlert;
  }

  async resolveAlert(id: number, user: User) {
    const alert = await this.alertRepository.findOne({
      where: { id, provinceId: user.provinceId },
    });

    if (!alert) {
      throw new NotFoundException('Alert not found or access denied');
    }

    alert.status = AlertStatus.RESOLVED;
    alert.resolvedAt = new Date();

    const updated = await this.alertRepository.save(alert);

    await this.logActivity(
      'alert_resolved',
      'Alert Resolved',
      `${user.name} resolved alert: ${alert.title}`,
      user.id,
      user.provinceId,
    );

    return updated;
  }

  async deleteAlert(id: number, user: User) {
    const alert = await this.alertRepository.findOne({
      where: { id, provinceId: user.provinceId },
    });

    if (!alert) {
      throw new NotFoundException('Alert not found or access denied');
    }

    await this.alertRepository.remove(alert);

    await this.logActivity(
      'alert_deleted',
      'Alert Deleted',
      `${user.name} deleted alert: ${alert.title}`,
      user.id,
      user.provinceId,
    );

    return { message: 'Alert deleted successfully' };
  }

  // ==================== SHELTERS ====================

  async getAllShelters(user: User, status?: string) {
    const districtIds = await this.getProvinceDistrictIds(user.provinceId);

    const where: any = {
      districtId: In(districtIds),
      isDeleted: false,
    };

    if (status) {
      where.status = status;
    }

    return await this.shelterRepository.find({
      where,
      order: { name: 'ASC' },
      relations: ['district'],
    });
  }

  async getShelterById(id: number, user: User) {
    const districtIds = await this.getProvinceDistrictIds(user.provinceId);

    const shelter = await this.shelterRepository.findOne({
      where: { id, districtId: In(districtIds), isDeleted: false },
      relations: ['district'],
    });

    if (!shelter) {
      throw new NotFoundException('Shelter not found or access denied');
    }

    return shelter;
  }

  async getShelterStats(user: User) {
    const districtIds = await this.getProvinceDistrictIds(user.provinceId);

    const stats = await this.shelterRepository
      .createQueryBuilder('shelter')
      .select('COUNT(*)', 'totalShelters')
      .addSelect('COALESCE(SUM(shelter.capacity), 0)', 'totalCapacity')
      .addSelect('COALESCE(SUM(shelter.occupancy), 0)', 'currentOccupancy')
      .where('shelter.district_id IN (:...districtIds)', { districtIds })
      .andWhere('shelter.is_deleted = false')
      .getRawOne();

    const totalShelters = parseInt(stats.totalShelters);
    const totalCapacity = parseInt(stats.totalCapacity);
    const currentOccupancy = parseInt(stats.currentOccupancy);
    const avgOccupancyPercent = totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0;

    return {
      totalShelters,
      totalCapacity,
      currentOccupancy,
      avgOccupancyPercent,
    };
  }

  async createShelter(createShelterDto: CreateShelterDto, user: User) {
    // Handle frontend form data compatibility
    const shelterData: Partial<Shelter> = {
      name: createShelterDto.name,
      address: createShelterDto.address || createShelterDto.location,
      capacity: typeof createShelterDto.capacity === 'string'
        ? parseInt(createShelterDto.capacity, 10) || 0
        : createShelterDto.capacity || 0,
      contactPhone: createShelterDto.contactPhone || createShelterDto.contact,
      managerName: createShelterDto.managerName || createShelterDto.contactPerson,
      managerPhone: createShelterDto.managerPhone,
      facilities: createShelterDto.facilities,
      amenities: createShelterDto.amenities,
      status: createShelterDto.status || ShelterStatus.OPERATIONAL,
      lat: createShelterDto.lat,
      lng: createShelterDto.lng,
    };

    // If districtId provided, verify access; otherwise assign first district in province
    if (createShelterDto.districtId) {
      await this.verifyDistrictAccess(createShelterDto.districtId, user.provinceId);
      shelterData.districtId = createShelterDto.districtId;
    } else {
      // Get first district in user's province as default
      const districts = await this.districtRepository.find({
        where: { provinceId: user.provinceId },
        take: 1,
      });
      if (districts.length > 0) {
        shelterData.districtId = districts[0].id;
      }
    }

    const shelter = this.shelterRepository.create(shelterData);
    const saved = await this.shelterRepository.save(shelter);

    await this.logActivity(
      'shelter_created',
      'Shelter Registered',
      `${user.name} registered shelter: ${saved.name}`,
      user.id,
      user.provinceId,
      saved.districtId,
    );

    return saved;
  }

  async updateShelter(id: number, updateShelterDto: UpdateShelterDto, user: User) {
    const districtIds = await this.getProvinceDistrictIds(user.provinceId);

    const shelter = await this.shelterRepository.findOne({
      where: { id, districtId: In(districtIds), isDeleted: false },
    });

    if (!shelter) {
      throw new NotFoundException('Shelter not found or access denied');
    }

    // Validate occupancy doesn't exceed capacity
    if (updateShelterDto.occupancy !== undefined && updateShelterDto.capacity !== undefined) {
      if (updateShelterDto.occupancy > updateShelterDto.capacity) {
        throw new BadRequestException('Occupancy cannot exceed capacity');
      }
    } else if (updateShelterDto.occupancy !== undefined) {
      if (updateShelterDto.occupancy > shelter.capacity) {
        throw new BadRequestException('Occupancy cannot exceed capacity');
      }
    } else if (updateShelterDto.capacity !== undefined) {
      if (shelter.occupancy > updateShelterDto.capacity) {
        throw new BadRequestException('Capacity cannot be less than current occupancy');
      }
    }

    Object.assign(shelter, updateShelterDto);
    const updated = await this.shelterRepository.save(shelter);

    await this.logActivity(
      'shelter_updated',
      'Shelter Updated',
      `${user.name} updated shelter: ${shelter.name}`,
      user.id,
      user.provinceId,
      shelter.districtId,
    );

    return updated;
  }

  async deleteShelter(id: number, user: User) {
    const districtIds = await this.getProvinceDistrictIds(user.provinceId);

    const shelter = await this.shelterRepository.findOne({
      where: { id, districtId: In(districtIds), isDeleted: false },
    });

    if (!shelter) {
      throw new NotFoundException('Shelter not found or access denied');
    }

    // Soft delete
    shelter.isDeleted = true;
    shelter.deletedAt = new Date();
    await this.shelterRepository.save(shelter);

    await this.logActivity(
      'shelter_deleted',
      'Shelter Removed',
      `${user.name} removed shelter: ${shelter.name}`,
      user.id,
      user.provinceId,
      shelter.districtId,
    );

    return { message: 'Shelter deleted successfully' };
  }

  // ==================== RESOURCES ====================

  /**
   * Get all province-level resources (not district-level)
   * These are resources allocated from NDMA to this province
   */
  async getAllResources(user: User, status?: string) {
    const where: any = {
      provinceId: user.provinceId,
      districtId: IsNull(), // Only province-level resources, not district-level
    };

    if (status) {
      where.status = status;
    }

    return await this.resourceRepository.find({
      where,
      order: { type: 'ASC', name: 'ASC' },
    });
  }

  async getResourceStats(user: User) {
    const stats = await this.resourceRepository
      .createQueryBuilder('resource')
      .select('COUNT(*)', 'totalResources')
      .addSelect('COALESCE(SUM(resource.quantity), 0)', 'totalQuantity')
      .addSelect('COALESCE(SUM(resource.allocated), 0)', 'totalAllocated')
      .where('resource.province_id = :provinceId', { provinceId: user.provinceId })
      .andWhere('resource.district_id IS NULL') // Only province-level resources
      .getRawOne();

    const totalResources = parseInt(stats.totalResources);
    const totalQuantity = parseInt(stats.totalQuantity);
    const totalAllocated = parseInt(stats.totalAllocated);
    const availableQuantity = totalQuantity - totalAllocated;
    const allocatedPercent = totalQuantity > 0 ? Math.round((totalAllocated / totalQuantity) * 100) : 0;

    return {
      totalResources,
      totalQuantity,
      totalAllocated,
      availableQuantity,
      allocatedPercent,
    };
  }

  async createResource(createResourceDto: CreateResourceDto, user: User) {
    // If districtId provided, verify it belongs to province
    if (createResourceDto.districtId) {
      await this.verifyDistrictAccess(createResourceDto.districtId, user.provinceId);
    }

    const resource = this.resourceRepository.create({
      ...createResourceDto,
      provinceId: user.provinceId,
    });

    const saved = await this.resourceRepository.save(resource);

    await this.logActivity(
      'resource_created',
      'Resource Added',
      `${user.name} added resource: ${saved.name} (${saved.quantity} ${saved.unit})`,
      user.id,
      user.provinceId,
    );

    return saved;
  }

  async updateResource(id: number, updateResourceDto: UpdateResourceDto, user: User) {
    const resource = await this.resourceRepository.findOne({
      where: { id, provinceId: user.provinceId },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found or access denied');
    }

    Object.assign(resource, updateResourceDto);
    const updated = await this.resourceRepository.save(resource);

    await this.logActivity(
      'resource_updated',
      'Resource Updated',
      `${user.name} updated resource: ${resource.name}`,
      user.id,
      user.provinceId,
    );

    return updated;
  }

  async allocateResource(id: number, allocateDto: AllocateResourceDto, user: User) {
    const provinceResource = await this.resourceRepository.findOne({
      where: { id, provinceId: user.provinceId },
    });

    if (!provinceResource) {
      throw new NotFoundException('Resource not found or access denied');
    }

    // Verify district belongs to province
    await this.verifyDistrictAccess(allocateDto.districtId, user.provinceId);

    // Check available quantity
    const available = provinceResource.quantity - provinceResource.allocated;
    if (allocateDto.quantity > available) {
      throw new BadRequestException(`Only ${available} ${provinceResource.unit} available for allocation`);
    }

    // Update province-level allocation tracking
    provinceResource.allocated += allocateDto.quantity;

    // Update province resource status based on allocation percentage
    const usagePercentage = (provinceResource.allocated / provinceResource.quantity) * 100;

    if (usagePercentage >= 100) {
      provinceResource.status = ResourceStatus.ALLOCATED;
    } else if (usagePercentage >= 90) {
      provinceResource.status = ResourceStatus.CRITICAL;
    } else if (usagePercentage >= 70) {
      provinceResource.status = ResourceStatus.LOW;
    } else {
      provinceResource.status = ResourceStatus.AVAILABLE;
    }

    await this.resourceRepository.save(provinceResource);

    // Create or update district-level resource
    let districtResource = await this.resourceRepository.findOne({
      where: {
        name: provinceResource.name,
        type: provinceResource.type,
        districtId: allocateDto.districtId,
        shelterId: IsNull(), // Only district-level, not shelter
      },
    });

    if (districtResource) {
      // Add to existing district resource
      districtResource.quantity += allocateDto.quantity;
      districtResource.allocated = districtResource.allocated || 0;
    } else {
      // Create new district resource
      districtResource = this.resourceRepository.create({
        name: provinceResource.name,
        icon: provinceResource.icon,
        type: provinceResource.type,
        category: provinceResource.category,
        resourceType: provinceResource.resourceType,
        quantity: allocateDto.quantity,
        unit: provinceResource.unit,
        location: `District ${allocateDto.districtId} Warehouse`,
        provinceId: user.provinceId,
        districtId: allocateDto.districtId,
        status: ResourceStatus.AVAILABLE,
        allocated: 0,
        allocatedQuantity: 0,
        description: allocateDto.purpose || provinceResource.description,
      });
    }

    const savedDistrictResource = await this.resourceRepository.save(districtResource);

    await this.logActivity(
      'resource_allocated',
      'Resource Allocated to District',
      `${user.name} allocated ${allocateDto.quantity} ${provinceResource.unit} of ${provinceResource.name} to district ${allocateDto.districtId}`,
      user.id,
      user.provinceId,
      allocateDto.districtId,
    );

    return {
      provinceResource,
      districtResource: savedDistrictResource,
      message: `Successfully allocated ${allocateDto.quantity} ${provinceResource.unit} of ${provinceResource.name} to district`,
    };
  }

  /**
   * Allocate resource by type (auto-creates province resource if needed)
   * This is used for manual allocation from the UI when selecting resource types
   */
  async allocateResourceByType(allocateDto: AllocateResourceDto & { resourceType: string }, user: User) {
    console.log('🔍 PDMA allocateResourceByType called with:', {
      resourceType: allocateDto.resourceType,
      districtId: allocateDto.districtId,
      quantity: allocateDto.quantity,
      purpose: allocateDto.purpose,
      userId: user.id,
      provinceId: user.provinceId
    });

    if (!user.provinceId) {
      throw new BadRequestException('User must be associated with a province');
    }

    // Find or create province resource by type
    let provinceResource = await this.resourceRepository.findOne({
      where: {
        type: allocateDto.resourceType,
        provinceId: user.provinceId,
        districtId: IsNull(),
      },
    });

    // If province resource doesn't exist, create it with default values
    if (!provinceResource) {
      const resourceDefaults = {
        food: { name: 'Food Supplies', unit: 'tons', quantity: 50000, icon: 'package' },
        water: { name: 'Water', unit: 'liters', quantity: 250000, icon: 'droplets' },
        medical: { name: 'Medical Supplies', unit: 'kits', quantity: 25000, icon: 'stethoscope' },
        shelter: { name: 'Shelter Materials', unit: 'units', quantity: 10000, icon: 'home' },
      };

      const defaults = resourceDefaults[allocateDto.resourceType.toLowerCase()] || {
        name: `${allocateDto.resourceType} Resources`,
        unit: 'units',
        quantity: 5000,
        icon: 'package'
      };

      const province = await this.provinceRepository.findOne({
        where: { id: user.provinceId }
      });

      const newResource = this.resourceRepository.create({
        name: defaults.name,
        type: allocateDto.resourceType,
        category: allocateDto.resourceType,
        resourceType: allocateDto.resourceType,
        quantity: defaults.quantity,
        unit: defaults.unit,
        icon: defaults.icon,
        location: `${province?.name || 'Province'} Central Warehouse`,
        provinceId: user.provinceId,
        status: ResourceStatus.AVAILABLE,
        allocated: 0,
        allocatedQuantity: 0,
        description: `Auto-created province ${allocateDto.resourceType} stock`,
      });

      provinceResource = await this.resourceRepository.save(newResource);

      await this.logActivity(
        'resource_created',
        'Province Resource Auto-Created',
        `System auto-created province resource: ${provinceResource.name} for allocation`,
        user.id,
        user.provinceId,
      );
    }

    // Now allocate using the existing method
    return await this.allocateResource(provinceResource.id, allocateDto, user);
  }

  // ==================== SOS REQUESTS ====================

  async getAllSosRequests(user: User, status?: string) {
    const districtIds = await this.getProvinceDistrictIds(user.provinceId);

    const where: any = {
      districtId: In(districtIds),
      isDeleted: false,
    };

    if (status) {
      where.status = status;
    }

    return await this.sosRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['district', 'rescueTeam'],
    });
  }

  async getSosRequestById(id: string, user: User) {
    const districtIds = await this.getProvinceDistrictIds(user.provinceId);

    const sosRequest = await this.sosRepository.findOne({
      where: { id, districtId: In(districtIds), isDeleted: false },
      relations: ['district', 'rescueTeam'],
    });

    if (!sosRequest) {
      throw new NotFoundException('SOS request not found or access denied');
    }

    return sosRequest;
  }

  async assignTeamToSos(id: string, assignTeamDto: AssignTeamDto, user: User) {
    const districtIds = await this.getProvinceDistrictIds(user.provinceId);

    const sosRequest = await this.sosRepository.findOne({
      where: { id, districtId: In(districtIds), isDeleted: false },
    });

    if (!sosRequest) {
      throw new NotFoundException('SOS request not found or access denied');
    }

    // Verify team exists and belongs to province
    const team = await this.rescueTeamRepository.findOne({
      where: { id: assignTeamDto.teamId, districtId: In(districtIds), isDeleted: false },
    });

    if (!team) {
      throw new NotFoundException('Rescue team not found or not available in your province');
    }

    sosRequest.assignedTeamId = assignTeamDto.teamId;
    sosRequest.assignedTeam = team.name;
    sosRequest.status = SosStatus.ASSIGNED;

    const updated = await this.sosRepository.save(sosRequest);

    await this.logActivity(
      'sos_team_assigned',
      'Team Assigned to SOS',
      `${user.name} assigned ${team.name} to SOS request ${id}`,
      user.id,
      user.provinceId,
      sosRequest.districtId,
    );

    return updated;
  }

  // ==================== RESCUE TEAMS ====================

  async getAllRescueTeams(user: User, status?: string) {
    const districtIds = await this.getProvinceDistrictIds(user.provinceId);

    const where: any = {
      districtId: In(districtIds),
      isDeleted: false,
    };

    if (status) {
      where.status = status;
    }

    return await this.rescueTeamRepository.find({
      where,
      order: { name: 'ASC' },
      relations: ['district'],
    });
  }

  async getRescueTeamById(id: string, user: User) {
    const districtIds = await this.getProvinceDistrictIds(user.provinceId);

    const team = await this.rescueTeamRepository.findOne({
      where: { id, districtId: In(districtIds), isDeleted: false },
      relations: ['district'],
    });

    if (!team) {
      throw new NotFoundException('Rescue team not found or access denied');
    }

    return team;
  }

  // ==================== ACTIVITY LOGS ====================

  async getActivityLogs(user: User, limit: number = 50) {
    return await this.activityLogRepository.find({
      where: { provinceId: user.provinceId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // ==================== PROVINCIAL MAP ====================

  async getMapData(user: User) {
    const districtIds = await this.getProvinceDistrictIds(user.provinceId);

    // Get all districts with their risk levels
    const districts = await this.districtRepository.find({
      where: { id: In(districtIds) },
      select: ['id', 'name', 'riskLevel', 'population'],
    });

    // Get shelters for each district
    const shelters = await this.shelterRepository.find({
      where: { districtId: In(districtIds), isDeleted: false },
      select: ['id', 'name', 'districtId', 'lat', 'lng', 'capacity', 'occupancy'],
    });

    // Get active SOS requests
    const sosRequests = await this.sosRepository.find({
      where: {
        districtId: In(districtIds),
        status: In([SosStatus.PENDING, SosStatus.ASSIGNED, SosStatus.EN_ROUTE]),
        isDeleted: false
      },
      select: ['id', 'districtId', 'locationLat', 'locationLng', 'peopleCount', 'status', 'priority'],
    });

    // Aggregate data by district for map zones
    const mapZones = districts.map(district => {
      const districtShelters = shelters.filter(s => s.districtId === district.id);
      const districtSOS = sosRequests.filter(sos => sos.districtId === district.id);
      const affectedPopulation = districtSOS.reduce((sum, sos) => sum + (sos.peopleCount || 0), 0);

      return {
        id: district.id,
        name: district.name,
        risk: district.riskLevel || 'stable',
        lat: 30.3753, // Default center for province (will be calculated from shelters)
        lon: 69.3451,
        population: district.population,
        affectedPopulation,
        shelters: districtShelters.length,
        activeSOS: districtSOS.length,
      };
    });

    return {
      zones: mapZones,
      shelters: shelters.map(s => ({
        id: s.id,
        name: s.name,
        lat: s.lat,
        lng: s.lng,
        capacity: s.capacity,
        occupancy: s.occupancy,
        districtId: s.districtId,
      })),
      sosMarkers: sosRequests.map(sos => ({
        id: sos.id,
        lat: sos.locationLat,
        lng: sos.locationLng,
        peopleCount: sos.peopleCount,
        status: sos.status,
        priority: sos.priority,
        districtId: sos.districtId,
      })),
    };
  }

  // ==================== RESOURCE REQUESTS ====================

  /**
   * Create a resource request from PDMA to NDMA
   */
  async createResourceRequest(createDto: CreateResourceRequestDto, user: User) {
    const request = this.resourceRequestRepository.create({
      provinceId: user.provinceId,
      requestedByUserId: user.id,
      requestedByName: user.name,
      priority: createDto.priority,
      reason: createDto.reason,
      notes: createDto.notes,
      requestedItems: createDto.requestedItems,
      status: ResourceRequestStatus.PENDING,
    });

    const saved = await this.resourceRequestRepository.save(request);

    await this.logActivity(
      'resource_request_created',
      'Resource Request Submitted to NDMA',
      `${user.name} requested resources from NDMA: ${createDto.requestedItems.length} items`,
      user.id,
      user.provinceId,
    );

    return saved;
  }

  /**
   * Get own resource requests (PDMA → NDMA)
   */
  async getOwnResourceRequests(user: User, status?: string) {
    const where: any = {
      provinceId: user.provinceId,
    };

    if (status) {
      where.status = status;
    }

    return await this.resourceRequestRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Get resource requests from districts (District → PDMA)
   * These are requests where districtId is set (from a district) 
   * and the district belongs to this PDMA's province
   */
  async getDistrictRequests(user: User, status?: string) {
    // Get all districts in this province
    const districts = await this.districtRepository.find({
      where: { provinceId: user.provinceId },
      select: ['id', 'name'],
    });

    const districtIds = districts.map(d => d.id);

    if (districtIds.length === 0) {
      return [];
    }

    // Get all resource requests and filter by districtId
    const allRequests = await this.resourceRequestRepository.find({
      order: { createdAt: 'DESC' },
    });

    // Filter to only requests from districts in this province
    let filteredRequests = allRequests.filter(req =>
      req.districtId && districtIds.includes(req.districtId)
    );

    // Apply status filter if provided
    if (status) {
      filteredRequests = filteredRequests.filter(req => req.status === status);
    }

    // Map district information to each request
    const districtMap = new Map(districts.map(d => [d.id, d]));
    return filteredRequests.map(req => ({
      ...req,
      district: districtMap.get(req.districtId) || null,
    }));
  }

  /**
   * Review a district's resource request (approve/reject)
   */
  async reviewDistrictRequest(
    requestId: number,
    reviewDto: { status: ResourceRequestStatus; notes?: string },
    user: User,
  ) {
    const request = await this.resourceRequestRepository.findOne({
      where: { id: requestId },
      relations: ['district'],
    });

    if (!request) {
      throw new NotFoundException('Resource request not found');
    }

    // Verify the request is from a district in this PDMA's province
    if (!request.districtId) {
      throw new BadRequestException('This is not a district request');
    }

    const district = await this.districtRepository.findOne({
      where: { id: request.districtId },
    });

    if (!district || district.provinceId !== user.provinceId) {
      throw new ForbiddenException('Cannot review requests from other provinces');
    }

    if (request.status !== ResourceRequestStatus.PENDING) {
      throw new BadRequestException('Request has already been reviewed');
    }

    // Update request status
    request.status = reviewDto.status;
    request.processedByUserId = user.id;
    request.processedByName = user.name;
    request.processedAt = new Date();
    if (reviewDto.notes) {
      request.notes = reviewDto.notes;
    }

    await this.resourceRequestRepository.save(request);

    // If approved, allocate resources to the district
    if (reviewDto.status === ResourceRequestStatus.APPROVED && request.requestedItems) {
      // Create/update resource records for the district
      for (const item of request.requestedItems) {
        const resourceName = item.resourceName || item.name || item.resourceType || 'Resource';
        const resourceType = item.resourceType || 'general';

        // Check if district already has this resource type
        const existingResource = await this.resourceRepository.findOne({
          where: {
            districtId: request.districtId,
            name: resourceName,
          },
        });

        if (existingResource) {
          // Update existing resource quantity
          existingResource.quantity += item.quantity;
          await this.resourceRepository.save(existingResource);
        } else {
          // Create new resource for the district
          const newResource = this.resourceRepository.create({
            name: resourceName,
            type: resourceType,
            category: item.category || 'allocated',
            quantity: item.quantity,
            unit: item.unit || 'units',
            status: ResourceStatus.AVAILABLE,
            districtId: request.districtId,
            provinceId: district.provinceId,
          } as any);
          await this.resourceRepository.save(newResource);
        }
      }

      await this.logActivity(
        'district_request_approved',
        'District Resource Request Approved',
        `${user.name} approved resource request from ${district.name} and allocated resources`,
        user.id,
        user.provinceId,
        district.id,
      );
    } else {
      await this.logActivity(
        'district_request_rejected',
        'District Resource Request Rejected',
        `${user.name} rejected resource request from ${district.name}`,
        user.id,
        user.provinceId,
        district.id,
      );
    }

    return request;
  }
}

