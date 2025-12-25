import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../common/entities/user.entity';
import { District } from '../common/entities/district.entity';
import { Shelter, ShelterStatus } from '../common/entities/shelter.entity';
import { Alert, AlertStatus } from '../common/entities/alert.entity';
import { Resource } from '../common/entities/resource.entity';
import { SosRequest, SosStatus } from '../common/entities/sos-request.entity';
import { RescueTeam, RescueTeamStatus } from '../common/entities/rescue-team.entity';
import { ActivityLog } from '../common/entities/activity-log.entity';
import { DamageReport, DamageReportStatus } from '../common/entities/damage-report.entity';
import { SosRequestTimeline } from '../common/entities/sos-request-timeline.entity';
import { WeatherData } from '../common/entities/weather-data.entity';
import { ResourceAllocation } from '../common/entities/resource-allocation.entity';
import {
  UpdateSosStatusDto,
  AssignTeamDto,
  AddTimelineEntryDto,
  CreateSosRequestDto,
} from './dtos/sos.dto';
import {
  UpdateTeamStatusDto,
  CreateRescueTeamDto,
  UpdateRescueTeamDto,
} from './dtos/rescue-team.dto';
import {
  CreateShelterDto,
  UpdateShelterDto,
  UpdateShelterSuppliesDto,
  UpdateShelterOccupancyDto,
} from './dtos/shelter.dto';
import {
  CreateDamageReportDto,
  VerifyDamageReportDto,
} from './dtos/damage-report.dto';

@Injectable()
export class DistrictService {
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
    @InjectRepository(DamageReport)
    private damageReportRepository: Repository<DamageReport>,
    @InjectRepository(SosRequestTimeline)
    private sosTimelineRepository: Repository<SosRequestTimeline>,
    @InjectRepository(WeatherData)
    private weatherDataRepository: Repository<WeatherData>,
    @InjectRepository(ResourceAllocation)
    private resourceAllocationRepository: Repository<ResourceAllocation>,
  ) {}

  // ==================== HELPER METHODS ====================

  /**
   * Verify user has access to their district
   */
  private verifyDistrictAccess(user: User): number {
    if (!user.districtId) {
      throw new ForbiddenException('User is not assigned to any district');
    }
    return user.districtId;
  }

  /**
   * Log activity
   */
  private async logActivity(
    activityType: string,
    title: string,
    description: string,
    userId: number,
    districtId: number,
  ): Promise<void> {
    await this.activityLogRepository.save({
      activityType,
      title,
      description,
      performedBy: userId,
      districtId,
    });
  }

  // ==================== DASHBOARD STATS ====================

  async getDashboardStats(user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const [
      pendingSOS,
      activeSOS,
      activeShelters,
      shelterCapacity,
      shelterOccupancy,
      activeTeams,
      availableTeams,
      localResources,
      pendingDamageReports,
      totalDamageReports,
    ] = await Promise.all([
      // Pending SOS requests
      this.sosRepository.count({
        where: {
          districtId,
          status: SosStatus.PENDING,
          isDeleted: false,
        },
      }),
      // Active SOS (Pending, Assigned, En-route, In Progress)
      this.sosRepository.count({
        where: {
          districtId,
          status: In([SosStatus.PENDING, SosStatus.ASSIGNED, SosStatus.EN_ROUTE, SosStatus.IN_PROGRESS]),
          isDeleted: false,
        },
      }),
      // Active shelters
      this.shelterRepository.count({
        where: {
          districtId,
          status: In([ShelterStatus.AVAILABLE, ShelterStatus.LIMITED, ShelterStatus.OPERATIONAL]),
          isDeleted: false,
        },
      }),
      // Total shelter capacity
      this.shelterRepository
        .createQueryBuilder('shelter')
        .select('COALESCE(SUM(shelter.capacity), 0)', 'total')
        .where('shelter.district_id = :districtId', { districtId })
        .andWhere('shelter.is_deleted = false')
        .getRawOne()
        .then(r => parseInt(r?.total, 10) || 0),
      // Current shelter occupancy
      this.shelterRepository
        .createQueryBuilder('shelter')
        .select('COALESCE(SUM(shelter.occupancy), 0)', 'total')
        .where('shelter.district_id = :districtId', { districtId })
        .andWhere('shelter.is_deleted = false')
        .getRawOne()
        .then(r => parseInt(r?.total, 10) || 0),
      // Active rescue teams (busy/deployed/on-mission)
      this.rescueTeamRepository.count({
        where: {
          districtId,
          status: In([RescueTeamStatus.BUSY, RescueTeamStatus.DEPLOYED, RescueTeamStatus.ON_MISSION]),
          isDeleted: false,
        },
      }),
      // Available rescue teams
      this.rescueTeamRepository.count({
        where: {
          districtId,
          status: RescueTeamStatus.AVAILABLE,
          isDeleted: false,
        },
      }),
      // Local resources in district
      this.resourceRepository.count({
        where: { districtId },
      }),
      // Pending damage reports
      this.damageReportRepository.count({
        where: {
          districtId,
          status: DamageReportStatus.PENDING,
        },
      }),
      // Total damage reports
      this.damageReportRepository.count({
        where: { districtId },
      }),
    ]);

    return {
      pendingSOS,
      activeSOS,
      activeShelters,
      shelterCapacity,
      shelterOccupancy,
      activeTeams,
      availableTeams,
      totalTeams: activeTeams + availableTeams,
      localResources,
      damageReports: totalDamageReports,
      pendingDamageReports,
    };
  }

  // ==================== DISTRICT INFO ====================

  async getDistrictInfo(user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const district = await this.districtRepository.findOne({
      where: { id: districtId },
    });

    if (!district) {
      throw new NotFoundException('District not found');
    }

    return district;
  }

  async getWeather(user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const weather = await this.weatherDataRepository.findOne({
      where: { districtId },
    });

    if (!weather) {
      // Return default weather data if none exists
      return {
        conditions: 'Clear',
        temperature: '25°C',
        forecast: 'No forecast available',
        humidity: '60%',
        windSpeed: '10 km/h',
        rainfall: '0mm',
      };
    }

    return weather;
  }

  // ==================== SOS REQUESTS ====================

  async getAllSosRequests(user: User, status?: string) {
    const districtId = this.verifyDistrictAccess(user);

    const where: any = {
      districtId,
      isDeleted: false,
    };

    if (status && status !== 'All') {
      where.status = status;
    }

    return await this.sosRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['rescueTeam'],
    });
  }

  async getSosRequestById(id: string, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const request = await this.sosRepository.findOne({
      where: { id, districtId, isDeleted: false },
      relations: ['rescueTeam', 'district'],
    });

    if (!request) {
      throw new NotFoundException(`SOS Request ${id} not found`);
    }

    // Get timeline for this request
    const timeline = await this.sosTimelineRepository.find({
      where: { sosRequestId: id },
      order: { createdAt: 'DESC' },
    });

    return { ...request, timeline };
  }

  async updateSosStatus(id: string, dto: UpdateSosStatusDto, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const request = await this.sosRepository.findOne({
      where: { id, districtId, isDeleted: false },
    });

    if (!request) {
      throw new NotFoundException(`SOS Request ${id} not found`);
    }

    // Validate status transition
    const validTransitions: Record<SosStatus, SosStatus[]> = {
      [SosStatus.PENDING]: [SosStatus.ASSIGNED, SosStatus.CANCELLED],
      [SosStatus.ASSIGNED]: [SosStatus.EN_ROUTE, SosStatus.CANCELLED],
      [SosStatus.EN_ROUTE]: [SosStatus.IN_PROGRESS, SosStatus.CANCELLED],
      [SosStatus.IN_PROGRESS]: [SosStatus.RESCUED, SosStatus.CANCELLED],
      [SosStatus.RESCUED]: [SosStatus.COMPLETED],
      [SosStatus.COMPLETED]: [],
      [SosStatus.CANCELLED]: [],
    };

    if (!validTransitions[request.status]?.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${request.status} to ${dto.status}`,
      );
    }

    request.status = dto.status;
    if (dto.status === SosStatus.COMPLETED || dto.status === SosStatus.RESCUED) {
      request.completedAt = new Date();
    }

    await this.sosRepository.save(request);

    // Add timeline entry
    await this.sosTimelineRepository.save({
      sosRequestId: id,
      title: `Status changed to ${dto.status}`,
      message: dto.notes || `SOS request status updated to ${dto.status}`,
      status: dto.status,
      timestamp: new Date(),
    });

    // Log activity
    await this.logActivity(
      'sos_update',
      'SOS Status Updated',
      `SOS ${id} status changed to ${dto.status}`,
      user.id,
      districtId,
    );

    return request;
  }

  async assignTeamToSos(id: string, dto: AssignTeamDto, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const request = await this.sosRepository.findOne({
      where: { id, districtId, isDeleted: false },
    });

    if (!request) {
      throw new NotFoundException(`SOS Request ${id} not found`);
    }

    if (request.status !== SosStatus.PENDING) {
      throw new BadRequestException('Can only assign team to pending requests');
    }

    // Verify team belongs to this district
    const team = await this.rescueTeamRepository.findOne({
      where: { id: dto.teamId, districtId, isDeleted: false },
    });

    if (!team) {
      throw new NotFoundException(`Rescue Team ${dto.teamId} not found in your district`);
    }

    if (team.status !== RescueTeamStatus.AVAILABLE) {
      throw new BadRequestException(`Team ${team.name} is not available`);
    }

    // Update SOS request
    request.assignedTeamId = dto.teamId;
    request.assignedTeam = team.name;
    request.status = SosStatus.ASSIGNED;
    request.estimatedArrival = dto.estimatedArrival || '15-20 min';
    await this.sosRepository.save(request);

    // Update team status
    team.status = RescueTeamStatus.ON_MISSION;
    team.currentMissionId = id;
    await this.rescueTeamRepository.save(team);

    // Add timeline entry
    await this.sosTimelineRepository.save({
      sosRequestId: id,
      title: 'Team Assigned',
      message: `${team.name} assigned to this request`,
      status: 'assigned',
      timestamp: new Date(),
    });

    // Log activity
    await this.logActivity(
      'team_assignment',
      'Rescue Team Assigned',
      `${team.name} assigned to SOS ${id}`,
      user.id,
      districtId,
    );

    return request;
  }

  async addTimelineEntry(id: string, dto: AddTimelineEntryDto, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const request = await this.sosRepository.findOne({
      where: { id, districtId, isDeleted: false },
    });

    if (!request) {
      throw new NotFoundException(`SOS Request ${id} not found`);
    }

    const entry = await this.sosTimelineRepository.save({
      sosRequestId: id,
      title: dto.title,
      message: dto.message,
      status: dto.status || 'info',
      timestamp: new Date(),
    });

    return entry;
  }

  async getSosStats(user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const [pending, assigned, enroute, inProgress, rescued, completed, cancelled] = await Promise.all([
      this.sosRepository.count({ where: { districtId, status: SosStatus.PENDING, isDeleted: false } }),
      this.sosRepository.count({ where: { districtId, status: SosStatus.ASSIGNED, isDeleted: false } }),
      this.sosRepository.count({ where: { districtId, status: SosStatus.EN_ROUTE, isDeleted: false } }),
      this.sosRepository.count({ where: { districtId, status: SosStatus.IN_PROGRESS, isDeleted: false } }),
      this.sosRepository.count({ where: { districtId, status: SosStatus.RESCUED, isDeleted: false } }),
      this.sosRepository.count({ where: { districtId, status: SosStatus.COMPLETED, isDeleted: false } }),
      this.sosRepository.count({ where: { districtId, status: SosStatus.CANCELLED, isDeleted: false } }),
    ]);

    return {
      pending,
      assigned,
      enroute,
      inProgress,
      rescued,
      completed,
      cancelled,
      total: pending + assigned + enroute + inProgress + rescued + completed + cancelled,
    };
  }

  // ==================== RESCUE TEAMS ====================

  async getAllRescueTeams(user: User, status?: string) {
    const districtId = this.verifyDistrictAccess(user);

    const where: any = {
      districtId,
      isDeleted: false,
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    return await this.rescueTeamRepository.find({
      where,
      order: { name: 'ASC' },
    });
  }

  async getRescueTeamById(id: string, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const team = await this.rescueTeamRepository.findOne({
      where: { id, districtId, isDeleted: false },
      relations: ['district'],
    });

    if (!team) {
      throw new NotFoundException(`Rescue Team ${id} not found`);
    }

    // Get current mission if any
    let currentMission: SosRequest | null = null;
    if (team.currentMissionId) {
      currentMission = await this.sosRepository.findOne({
        where: { id: team.currentMissionId },
      });
    }

    return { ...team, currentMission };
  }

  async updateTeamStatus(id: string, dto: UpdateTeamStatusDto, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const team = await this.rescueTeamRepository.findOne({
      where: { id, districtId, isDeleted: false },
    });

    if (!team) {
      throw new NotFoundException(`Rescue Team ${id} not found`);
    }

    team.status = dto.status;
    if (dto.currentLocation) {
      team.currentLocation = dto.currentLocation;
    }

    // If setting to available, clear current mission
    if (dto.status === RescueTeamStatus.AVAILABLE) {
      team.currentMissionId = undefined as any;
    }

    await this.rescueTeamRepository.save(team);

    // Log activity
    await this.logActivity(
      'team_status',
      'Team Status Updated',
      `${team.name} status changed to ${dto.status}`,
      user.id,
      districtId,
    );

    return team;
  }

  async createRescueTeam(dto: CreateRescueTeamDto, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    // Generate team ID
    const count = await this.rescueTeamRepository.count();
    const teamId = `RT-${String(count + 1).padStart(3, '0')}`;

    const team = this.rescueTeamRepository.create({
      id: teamId,
      ...dto,
      districtId,
      status: RescueTeamStatus.AVAILABLE,
      members: dto.members || 8,
      memberCount: dto.members || 8,
      leader: dto.leader,
      leaderName: dto.leader,
      contact: dto.contact,
      contactPhone: dto.contact,
    });

    await this.rescueTeamRepository.save(team);

    // Log activity
    await this.logActivity(
      'team_created',
      'Rescue Team Created',
      `New team ${team.name} created`,
      user.id,
      districtId,
    );

    return team;
  }

  async updateRescueTeam(id: string, dto: UpdateRescueTeamDto, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const team = await this.rescueTeamRepository.findOne({
      where: { id, districtId, isDeleted: false },
    });

    if (!team) {
      throw new NotFoundException(`Rescue Team ${id} not found`);
    }

    Object.assign(team, dto);
    if (dto.leader) {
      team.leaderName = dto.leader;
    }
    if (dto.contact) {
      team.contactPhone = dto.contact;
    }
    if (dto.members) {
      team.memberCount = dto.members;
    }

    await this.rescueTeamRepository.save(team);

    return team;
  }

  async getRescueTeamStats(user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const [available, busy, deployed, onMission, unavailable, resting] = await Promise.all([
      this.rescueTeamRepository.count({ where: { districtId, status: RescueTeamStatus.AVAILABLE, isDeleted: false } }),
      this.rescueTeamRepository.count({ where: { districtId, status: RescueTeamStatus.BUSY, isDeleted: false } }),
      this.rescueTeamRepository.count({ where: { districtId, status: RescueTeamStatus.DEPLOYED, isDeleted: false } }),
      this.rescueTeamRepository.count({ where: { districtId, status: RescueTeamStatus.ON_MISSION, isDeleted: false } }),
      this.rescueTeamRepository.count({ where: { districtId, status: RescueTeamStatus.UNAVAILABLE, isDeleted: false } }),
      this.rescueTeamRepository.count({ where: { districtId, status: RescueTeamStatus.RESTING, isDeleted: false } }),
    ]);

    const total = available + busy + deployed + onMission + unavailable + resting;

    return {
      total,
      available,
      busy,
      deployed,
      onMission,
      unavailable,
      resting,
      availablePercent: total > 0 ? Math.round((available / total) * 100) : 0,
    };
  }

  // ==================== SHELTERS ====================

  async getAllShelters(user: User, status?: string) {
    const districtId = this.verifyDistrictAccess(user);

    const where: any = {
      districtId,
      isDeleted: false,
    };

    if (status && status !== 'all') {
      where.status = status;
    }

    return await this.shelterRepository.find({
      where,
      order: { name: 'ASC' },
    });
  }

  async getShelterById(id: number, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const shelter = await this.shelterRepository.findOne({
      where: { id, districtId, isDeleted: false },
    });

    if (!shelter) {
      throw new NotFoundException(`Shelter ${id} not found`);
    }

    return shelter;
  }

  async createShelter(dto: CreateShelterDto, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const shelter = this.shelterRepository.create({
      name: dto.name,
      address: dto.address,
      capacity: dto.capacity,
      occupancy: dto.occupancy || 0,
      managerName: dto.contactPerson,
      managerPhone: dto.contactPhone,
      lat: dto.lat,
      lng: dto.lng,
      amenities: dto.amenities || [],
      supplyFood: dto.supplyFood ?? 0,
      supplyWater: dto.supplyWater ?? 0,
      supplyMedical: dto.supplyMedical ?? 0,
      supplyTents: dto.supplyTents ?? 0,
      districtId,
      status: ShelterStatus.AVAILABLE,
      isDeleted: false,
    });

    await this.shelterRepository.save(shelter);

    // Log activity
    await this.logActivity(
      'shelter_create',
      'Shelter Created',
      `New shelter "${shelter.name}" created`,
      user.id,
      districtId,
    );

    return shelter;
  }

  async deleteShelter(id: number, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const shelter = await this.shelterRepository.findOne({
      where: { id, districtId, isDeleted: false },
    });

    if (!shelter) {
      throw new NotFoundException(`Shelter ${id} not found`);
    }

    // Soft delete
    shelter.isDeleted = true;
    shelter.deletedAt = new Date();
    await this.shelterRepository.save(shelter);

    // Log activity
    await this.logActivity(
      'shelter_delete',
      'Shelter Deleted',
      `Shelter "${shelter.name}" deleted`,
      user.id,
      districtId,
    );

    return { success: true, message: 'Shelter deleted successfully' };
  }

  async updateShelter(id: number, dto: UpdateShelterDto, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const shelter = await this.shelterRepository.findOne({
      where: { id, districtId, isDeleted: false },
    });

    if (!shelter) {
      throw new NotFoundException(`Shelter ${id} not found`);
    }

    // Validate occupancy doesn't exceed capacity
    const newCapacity = dto.capacity ?? shelter.capacity;
    const newOccupancy = dto.occupancy ?? shelter.occupancy;
    if (newOccupancy > newCapacity) {
      throw new BadRequestException('Occupancy cannot exceed capacity');
    }

    Object.assign(shelter, dto);
    if (dto.contactPerson) {
      shelter.managerName = dto.contactPerson;
    }
    if (dto.contactPhone) {
      shelter.managerPhone = dto.contactPhone;
    }

    // Auto-update status based on occupancy if occupancy changed
    if (dto.occupancy !== undefined) {
      const occupancyPercent = (shelter.occupancy / shelter.capacity) * 100;
      if (occupancyPercent >= 100) {
        shelter.status = ShelterStatus.FULL;
      } else if (occupancyPercent >= 90) {
        shelter.status = ShelterStatus.LIMITED;
      } else {
        shelter.status = ShelterStatus.AVAILABLE;
      }
    }

    await this.shelterRepository.save(shelter);

    // Log activity
    await this.logActivity(
      'shelter_update',
      'Shelter Updated',
      `Shelter ${shelter.name} updated`,
      user.id,
      districtId,
    );

    return shelter;
  }

  async updateShelterSupplies(id: number, dto: UpdateShelterSuppliesDto, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const shelter = await this.shelterRepository.findOne({
      where: { id, districtId, isDeleted: false },
    });

    if (!shelter) {
      throw new NotFoundException(`Shelter ${id} not found`);
    }

    if (dto.supplyFood !== undefined) shelter.supplyFood = dto.supplyFood;
    if (dto.supplyWater !== undefined) shelter.supplyWater = dto.supplyWater;
    if (dto.supplyMedical !== undefined) shelter.supplyMedical = dto.supplyMedical;
    if (dto.supplyTents !== undefined) shelter.supplyTents = dto.supplyTents;

    await this.shelterRepository.save(shelter);

    return shelter;
  }

  async updateShelterOccupancy(id: number, dto: UpdateShelterOccupancyDto, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const shelter = await this.shelterRepository.findOne({
      where: { id, districtId, isDeleted: false },
    });

    if (!shelter) {
      throw new NotFoundException(`Shelter ${id} not found`);
    }

    if (dto.occupancy > shelter.capacity) {
      throw new BadRequestException('Occupancy cannot exceed capacity');
    }

    shelter.occupancy = dto.occupancy;

    // Auto-update status based on occupancy
    const occupancyPercent = (dto.occupancy / shelter.capacity) * 100;
    if (occupancyPercent >= 100) {
      shelter.status = ShelterStatus.FULL;
    } else if (occupancyPercent >= 90) {
      shelter.status = ShelterStatus.LIMITED;
    } else {
      shelter.status = ShelterStatus.AVAILABLE;
    }

    await this.shelterRepository.save(shelter);

    return shelter;
  }

  async resetShelterSupplies(id: number, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const shelter = await this.shelterRepository.findOne({
      where: { id, districtId, isDeleted: false },
    });

    if (!shelter) {
      throw new NotFoundException(`Shelter ${id} not found`);
    }

    shelter.supplyFood = 0;
    shelter.supplyWater = 0;
    shelter.supplyMedical = 0;
    shelter.supplyTents = 0;

    await this.shelterRepository.save(shelter);

    await this.logActivity(
      'shelter_supplies_reset',
      'Shelter Supplies Reset',
      `Reset all supplies for shelter "${shelter.name}" to 0%`,
      user.id,
      districtId,
    );

    return shelter;
  }

  async getShelterStats(user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const shelters = await this.shelterRepository.find({
      where: { districtId, isDeleted: false },
    });

    const totalShelters = shelters.length;
    const totalCapacity = shelters.reduce((sum, s) => sum + (s.capacity || 0), 0);
    const currentOccupancy = shelters.reduce((sum, s) => sum + (s.occupancy || 0), 0);
    const occupancyPercent = totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0;

    const availableShelters = shelters.filter(s => {
      const pct = s.capacity > 0 ? (s.occupancy / s.capacity) * 100 : 100;
      return pct < 90;
    }).length;
    const nearFullShelters = shelters.filter(s => {
      const pct = s.capacity > 0 ? (s.occupancy / s.capacity) * 100 : 100;
      return pct >= 90 && pct < 100;
    }).length;
    const fullShelters = shelters.filter(s => {
      const pct = s.capacity > 0 ? (s.occupancy / s.capacity) * 100 : 100;
      return pct >= 100;
    }).length;

    return {
      totalShelters,
      totalCapacity,
      currentOccupancy,
      occupancyPercent,
      availableShelters,
      nearFullShelters,
      fullShelters,
    };
  }

  // ==================== DAMAGE REPORTS ====================

  async getAllDamageReports(user: User, status?: string) {
    const districtId = this.verifyDistrictAccess(user);

    const where: any = { districtId };

    if (status && status !== 'all') {
      where.status = status;
    }

    return await this.damageReportRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async getDamageReportById(id: string, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const report = await this.damageReportRepository.findOne({
      where: { id, districtId },
    });

    if (!report) {
      throw new NotFoundException(`Damage Report ${id} not found`);
    }

    return report;
  }

  async createDamageReport(dto: CreateDamageReportDto, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    // Generate report ID
    const count = await this.damageReportRepository.count();
    const reportId = `DR-${String(count + 1).padStart(3, '0')}`;

    const report = this.damageReportRepository.create({
      id: reportId,
      location: dto.location,
      description: dto.description,
      districtId,
      submittedBy: user.name,
      submittedByUserId: user.id,
      status: DamageReportStatus.PENDING,
    });

    await this.damageReportRepository.save(report);

    // Log activity
    await this.logActivity(
      'damage_report',
      'Damage Report Created',
      `New damage report at ${dto.location}`,
      user.id,
      districtId,
    );

    return report;
  }

  async verifyDamageReport(id: string, dto: VerifyDamageReportDto, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const report = await this.damageReportRepository.findOne({
      where: { id, districtId },
    });

    if (!report) {
      throw new NotFoundException(`Damage Report ${id} not found`);
    }

    if (report.status === DamageReportStatus.VERIFIED) {
      throw new BadRequestException('Report is already verified');
    }

    report.status = DamageReportStatus.VERIFIED;
    report.verifiedBy = user.id;
    report.verifiedAt = new Date();

    await this.damageReportRepository.save(report);

    // Log activity
    await this.logActivity(
      'damage_verified',
      'Damage Report Verified',
      `Damage report ${id} verified`,
      user.id,
      districtId,
    );

    return report;
  }

  async getDamageReportStats(user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const [pending, verified] = await Promise.all([
      this.damageReportRepository.count({ where: { districtId, status: DamageReportStatus.PENDING } }),
      this.damageReportRepository.count({ where: { districtId, status: DamageReportStatus.VERIFIED } }),
    ]);

    return {
      total: pending + verified,
      pending,
      verified,
    };
  }

  // ==================== ALERTS ====================

  async getAlerts(user: User, status?: string) {
    const districtId = this.verifyDistrictAccess(user);

    const where: any = {
      districtId,
    };

    if (status) {
      where.status = status;
    } else {
      where.status = AlertStatus.ACTIVE;
    }

    return await this.alertRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  // ==================== ACTIVITY LOGS ====================

  async getActivityLogs(user: User, limit: number = 20) {
    const districtId = this.verifyDistrictAccess(user);

    return await this.activityLogRepository.find({
      where: { districtId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // ==================== RESOURCES ====================

  /**
   * Get all resources allocated to this district
   */
  async getAllResources(user: User) {
    const districtId = this.verifyDistrictAccess(user);

    return await this.resourceRepository.find({
      where: { districtId },
      order: { name: 'ASC' },
    });
  }

  /**
   * Get resource statistics for this district
   */
  async getResourceStats(user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const resources = await this.resourceRepository.find({
      where: { districtId },
    });

    const totalResources = resources.length;
    const totalQuantity = resources.reduce((sum, r) => sum + (r.quantity || 0), 0);
    const totalAllocated = resources.reduce((sum, r) => sum + (r.allocated || r.allocatedQuantity || 0), 0);

    return {
      totalResources,
      totalQuantity,
      totalAllocated,
      availableQuantity: totalQuantity - totalAllocated,
      allocatedPercent: totalQuantity > 0 ? Math.round((totalAllocated / totalQuantity) * 100) : 0,
    };
  }

  /**
   * Get a single resource by ID
   */
  async getResourceById(id: number, user: User) {
    const districtId = this.verifyDistrictAccess(user);

    const resource = await this.resourceRepository.findOne({
      where: { id, districtId },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found in this district');
    }

    return resource;
  }

  /**
   * Allocate resource to a shelter within the district
   */
  async allocateResourceToShelter(
    resourceId: number,
    dto: { shelterId: number; quantity: number; notes?: string },
    user: User,
  ) {
    const districtId = this.verifyDistrictAccess(user);

    const resource = await this.resourceRepository.findOne({
      where: { id: resourceId, districtId },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found in this district');
    }

    const shelter = await this.shelterRepository.findOne({
      where: { id: dto.shelterId, districtId, isDeleted: false },
    });

    if (!shelter) {
      throw new NotFoundException('Shelter not found in this district');
    }

    const availableQuantity = resource.quantity - (resource.allocated || 0);
    if (dto.quantity > availableQuantity) {
      throw new BadRequestException(
        `Insufficient quantity. Available: ${availableQuantity}, Requested: ${dto.quantity}`,
      );
    }

    // Update resource allocated amount
    resource.allocated = (resource.allocated || 0) + dto.quantity;
    resource.allocatedQuantity = resource.allocated;
    await this.resourceRepository.save(resource);

    // Update shelter supply levels based on resource type
    const resourceType = (resource.type || resource.resourceType || '').toLowerCase();
    const supplyIncrease = Math.min(10, dto.quantity); // Each unit increases supply by up to 10%
    
    if (resourceType.includes('food')) {
      shelter.supplyFood = Math.min(100, (shelter.supplyFood || 0) + supplyIncrease);
    } else if (resourceType.includes('water')) {
      shelter.supplyWater = Math.min(100, (shelter.supplyWater || 0) + supplyIncrease);
    } else if (resourceType.includes('medical')) {
      shelter.supplyMedical = Math.min(100, (shelter.supplyMedical || 0) + supplyIncrease);
    } else if (resourceType.includes('tent') || resourceType.includes('shelter')) {
      shelter.supplyTents = Math.min(100, (shelter.supplyTents || 0) + supplyIncrease);
    } else {
      // For other resource types, distribute evenly
      const distributedIncrease = Math.floor(supplyIncrease / 4);
      shelter.supplyFood = Math.min(100, (shelter.supplyFood || 0) + distributedIncrease);
      shelter.supplyWater = Math.min(100, (shelter.supplyWater || 0) + distributedIncrease);
      shelter.supplyMedical = Math.min(100, (shelter.supplyMedical || 0) + distributedIncrease);
      shelter.supplyTents = Math.min(100, (shelter.supplyTents || 0) + distributedIncrease);
    }
    
    await this.shelterRepository.save(shelter);

    // Create allocation record for audit trail
    const allocation = this.resourceAllocationRepository.create({
      resourceId: resource.id,
      allocatedToShelterId: shelter.id,
      quantity: dto.quantity,
      purpose: dto.notes || `Allocated to ${shelter.name}`,
      allocatedBy: user.id,
    });
    await this.resourceAllocationRepository.save(allocation);

    // Log the activity
    await this.logActivity(
      'resource_allocation',
      'Resource Allocated to Shelter',
      `Allocated ${dto.quantity} units of ${resource.name} to ${shelter.name}${dto.notes ? ` - ${dto.notes}` : ''}`,
      user.id,
      districtId,
    );

    return {
      success: true,
      message: `Successfully allocated ${dto.quantity} units of ${resource.name} to ${shelter.name}`,
      resource,
      shelter,
      allocation,
    };
  }

  /**
   * Get shelters available for resource allocation
   */
  async getSheltersForAllocation(user: User) {
    const districtId = this.verifyDistrictAccess(user);

    return await this.shelterRepository.find({
      where: {
        districtId,
        isDeleted: false,
      },
      select: ['id', 'name', 'address', 'capacity', 'occupancy', 'status'],
      order: { name: 'ASC' },
    });
  }
}
