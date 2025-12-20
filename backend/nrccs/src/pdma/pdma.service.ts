import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../common/entities/user.entity';
import { District } from '../common/entities/district.entity';
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

@Injectable()
export class PdmaService {
  constructor(
    @InjectRepository(District)
    private districtRepository: Repository<District>,
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
  ) {}

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

  async getAllResources(user: User, status?: string) {
    const where: any = {
      provinceId: user.provinceId,
    };

    if (status) {
      where.status = status;
    }

    return await this.resourceRepository.find({
      where,
      order: { name: 'ASC' },
    });
  }

  async getResourceStats(user: User) {
    const stats = await this.resourceRepository
      .createQueryBuilder('resource')
      .select('COUNT(*)', 'totalResources')
      .addSelect('COALESCE(SUM(resource.quantity), 0)', 'totalQuantity')
      .addSelect('COALESCE(SUM(resource.allocated), 0)', 'totalAllocated')
      .where('resource.province_id = :provinceId', { provinceId: user.provinceId })
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
    const resource = await this.resourceRepository.findOne({
      where: { id, provinceId: user.provinceId },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found or access denied');
    }

    // Verify district belongs to province
    await this.verifyDistrictAccess(allocateDto.districtId, user.provinceId);

    // Check available quantity
    const available = resource.quantity - resource.allocated;
    if (allocateDto.quantity > available) {
      throw new BadRequestException(`Only ${available} ${resource.unit} available for allocation`);
    }

    // Update allocation
    resource.allocated += allocateDto.quantity;
    
    // Update resource status based on allocation percentage
    const newAvailable = resource.quantity - resource.allocated;
    const usagePercentage = (resource.allocated / resource.quantity) * 100;
    
    if (newAvailable === 0) {
      // Fully allocated
      resource.status = ResourceStatus.ALLOCATED;
    } else if (usagePercentage >= 90) {
      // Critical: 90% or more used
      resource.status = ResourceStatus.CRITICAL;
    } else if (usagePercentage >= 70) {
      // Low: 70-89% used
      resource.status = ResourceStatus.LOW;
    } else {
      // Still available
      resource.status = ResourceStatus.AVAILABLE;
    }
    
    const updated = await this.resourceRepository.save(resource);

    await this.logActivity(
      'resource_allocated',
      'Resource Allocated',
      `${user.name} allocated ${allocateDto.quantity} ${resource.unit} of ${resource.name} to district ${allocateDto.districtId}`,
      user.id,
      user.provinceId,
      allocateDto.districtId,
    );

    return updated;
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
}
