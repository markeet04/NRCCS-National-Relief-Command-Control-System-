// NDMA Service - National Disaster Management Authority
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { User } from '../common/entities/user.entity';
import { Province } from '../common/entities/province.entity';
import { District } from '../common/entities/district.entity';
import { Shelter } from '../common/entities/shelter.entity';
import { Alert, AlertStatus, AlertSeverity } from '../common/entities/alert.entity';
import { Resource, ResourceStatus } from '../common/entities/resource.entity';
import { SosRequest, SosStatus } from '../common/entities/sos-request.entity';
import { RescueTeam, RescueTeamStatus } from '../common/entities/rescue-team.entity';
import { ActivityLog } from '../common/entities/activity-log.entity';
import { ResourceRequest, ResourceRequestStatus } from '../common/entities/resource-request.entity';
import { NdmaResourceAllocation, NdmaAllocationStatus } from '../common/entities/ndma-resource-allocation.entity';
import { ResourceAllocation } from '../common/entities/resource-allocation.entity';
import { CreateAlertDto } from './dtos/alert.dto';
import {
    CreateNationalResourceDto,
    AllocateResourceToProvinceDto,
    ReviewResourceRequestDto,
    IncreaseNationalStockDto
} from './dtos/resource.dto';

@Injectable()
export class NdmaService {
    constructor(
        @InjectRepository(Province)
        private provinceRepository: Repository<Province>,
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
        @InjectRepository(ResourceRequest)
        private resourceRequestRepository: Repository<ResourceRequest>,
        @InjectRepository(NdmaResourceAllocation)
        private ndmaAllocationRepository: Repository<NdmaResourceAllocation>,
        @InjectRepository(ResourceAllocation)
        private resourceAllocationRepository: Repository<ResourceAllocation>,
    ) { }

    // ==================== HELPER METHODS ====================

    /**
     * Log activity for NDMA actions
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

    /**
     * Create alert from ML flood prediction
     * High risk → critical severity, Medium → high severity
     * NDMA-only: Automatically generates alerts for PDMA consumption
     */
    async createAlertFromPrediction(
        prediction: { flood_risk: string; confidence: number; simulationMode?: boolean; simulationScenario?: string },
        provinceId: number,
        user: User,
    ): Promise<Alert | null> {
        // Only create alerts for Medium or High risk
        if (prediction.flood_risk === 'Low') {
            return null;
        }

        // Map risk to severity
        const severity = prediction.flood_risk === 'High'
            ? AlertSeverity.CRITICAL
            : AlertSeverity.HIGH;

        // Get province name
        const province = await this.provinceRepository.findOne({
            where: { id: provinceId },
            select: ['id', 'name'],
        });

        if (!province) {
            throw new NotFoundException(`Province with ID ${provinceId} not found`);
        }

        // Build alert description
        const simulationNote = prediction.simulationMode
            ? ` [SIMULATION: ${prediction.simulationScenario}]`
            : '';

        const description = `ML-generated flood prediction indicates ${prediction.flood_risk} risk for ${province.name}.${simulationNote}`;

        // Create alert (PDMA will see this, but NOT the ML internals)
        const alert = this.alertRepository.create({
            title: `Flood Warning - ${province.name}`,
            type: 'flood_warning',
            alertType: 'flood_warning',
            severity,
            status: AlertStatus.ACTIVE,
            description,
            shortDescription: `${prediction.flood_risk} flood risk detected`,
            provinceId: province.id,
            province: province.name,
            issuedBy: 'NDMA ML System',
            issuedByUserId: user.id,
            source: prediction.simulationMode ? 'ML_SIMULATION' : 'ML_LIVE',
            affectedAreas: [province.name],
            recommendedActions: this.getRecommendedActions(prediction.flood_risk),
            issuedAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        });

        const savedAlert = await this.alertRepository.save(alert);

        // Log activity
        await this.logActivity(
            'ml_alert_generated',
            'ML Flood Alert Generated',
            `${prediction.flood_risk} risk alert created for ${province.name}${simulationNote}`,
            user.id,
            provinceId,
        );

        console.log(`[NDMA] ML Alert created: ${savedAlert.id} - ${prediction.flood_risk} risk for ${province.name}`);

        return savedAlert;
    }

    /**
     * Get recommended actions based on risk level
     */
    private getRecommendedActions(risk: string): string[] {
        if (risk === 'High') {
            return [
                'Initiate immediate evacuation protocols',
                'Deploy rescue teams to affected areas',
                'Open emergency shelters',
                'Issue public emergency broadcast',
                'Coordinate with provincial authorities',
            ];
        } else if (risk === 'Medium') {
            return [
                'Monitor water levels continuously',
                'Prepare evacuation routes',
                'Alert local authorities',
                'Pre-position rescue resources',
                'Issue weather advisory',
            ];
        }
        return [];
    }

    // ==================== DASHBOARD STATS ====================

    async getDashboardStats(user: User) {
        const [
            activeSOS,
            totalShelters,
            peopleSheltered,
            activeTeams,
            activeAlerts,
            affectedDistricts,
            totalResources,
            provinces,
        ] = await Promise.all([
            // Active SOS requests nationally
            this.sosRepository.count({
                where: {
                    status: In(['Pending', 'Assigned', 'En-route', 'In Progress']),
                    isDeleted: false,
                },
            }),
            // Total active shelters
            this.shelterRepository.count({
                where: {
                    status: In(['available', 'limited', 'operational']),
                    isDeleted: false,
                },
            }),
            // People in shelters
            this.shelterRepository
                .createQueryBuilder('shelter')
                .select('COALESCE(SUM(shelter.occupancy), 0)', 'total')
                .where('shelter.is_deleted = false')
                .getRawOne()
                .then(r => parseInt(r?.total, 10) || 0),
            // Active rescue teams
            this.rescueTeamRepository.count({
                where: {
                    status: In(['available', 'deployed', 'on-mission']),
                    isDeleted: false,
                },
            }),
            // Active alerts
            this.alertRepository.count({
                where: { status: AlertStatus.ACTIVE },
            }),
            // Affected districts (critical or high risk)
            this.districtRepository.count({
                where: { riskLevel: In(['critical', 'high']) },
            }),
            // Total resource count - ONLY national-level resources
            this.resourceRepository
                .createQueryBuilder('resource')
                .select('COALESCE(SUM(resource.quantity), 0)', 'total')
                .where('resource.province_id IS NULL')
                .andWhere('resource.district_id IS NULL')
                .andWhere('resource.shelter_id IS NULL')
                .getRawOne()
                .then(r => parseInt(r?.total, 10) || 0),
            // Province count
            this.provinceRepository.count(),
        ]);

        return {
            activeSOS,
            totalShelters,
            peopleSheltered,
            activeTeams,
            activeAlerts,
            affectedDistricts,
            totalResources,
            totalProvinces: provinces,
        };
    }

    async getProvinceSummaries(user: User) {
        const provinces = await this.provinceRepository.find({
            order: { name: 'ASC' },
        });

        // Get stats for each province
        const summaries = await Promise.all(
            provinces.map(async (province) => {
                const districts = await this.districtRepository.find({
                    where: { provinceId: province.id },
                    select: ['id'],
                });
                const districtIds = districts.map(d => d.id);

                if (districtIds.length === 0) {
                    return {
                        ...province,
                        activeSOS: 0,
                        activeAlerts: 0,
                        totalShelters: 0,
                        criticalDistricts: 0,
                    };
                }

                const [activeSOS, activeAlerts, totalShelters, criticalDistricts] = await Promise.all([
                    this.sosRepository.count({
                        where: {
                            districtId: In(districtIds),
                            status: In(['Pending', 'Assigned', 'En-route', 'In Progress']),
                            isDeleted: false,
                        },
                    }),
                    this.alertRepository.count({
                        where: { provinceId: province.id, status: AlertStatus.ACTIVE },
                    }),
                    this.shelterRepository.count({
                        where: { districtId: In(districtIds), isDeleted: false },
                    }),
                    this.districtRepository.count({
                        where: { provinceId: province.id, riskLevel: In(['critical', 'high']) },
                    }),
                ]);

                return {
                    ...province,
                    activeSOS,
                    activeAlerts,
                    totalShelters,
                    criticalDistricts,
                };
            }),
        );

        return summaries;
    }

    // ==================== PROVINCES ====================

    async getAllProvinces(user: User) {
        return await this.provinceRepository.find({
            order: { name: 'ASC' },
        });
    }

    async getProvinceById(id: number, user: User) {
        const province = await this.provinceRepository.findOne({
            where: { id },
        });

        if (!province) {
            throw new NotFoundException(`Province with ID ${id} not found`);
        }

        return province;
    }

    async getProvinceStats(id: number, user: User) {
        const province = await this.getProvinceById(id, user);

        const districts = await this.districtRepository.find({
            where: { provinceId: id },
            select: ['id'],
        });
        const districtIds = districts.map(d => d.id);

        if (districtIds.length === 0) {
            return {
                province,
                activeSOS: 0,
                totalShelters: 0,
                peopleSheltered: 0,
                activeTeams: 0,
                activeAlerts: 0,
                totalDistricts: 0,
                criticalDistricts: 0,
            };
        }

        const [activeSOS, totalShelters, peopleSheltered, activeTeams, activeAlerts, criticalDistricts] = await Promise.all([
            this.sosRepository.count({
                where: { districtId: In(districtIds), status: In(['Pending', 'Assigned', 'En-route', 'In Progress']), isDeleted: false },
            }),
            this.shelterRepository.count({
                where: { districtId: In(districtIds), isDeleted: false },
            }),
            this.shelterRepository
                .createQueryBuilder('shelter')
                .select('COALESCE(SUM(shelter.occupancy), 0)', 'total')
                .where('shelter.district_id IN (:...districtIds)', { districtIds })
                .andWhere('shelter.is_deleted = false')
                .getRawOne()
                .then(r => parseInt(r?.total, 10) || 0),
            this.rescueTeamRepository.count({
                where: { districtId: In(districtIds), status: In(['available', 'deployed', 'on-mission']), isDeleted: false },
            }),
            this.alertRepository.count({
                where: { provinceId: id, status: AlertStatus.ACTIVE },
            }),
            this.districtRepository.count({
                where: { provinceId: id, riskLevel: In(['critical', 'high']) },
            }),
        ]);

        return {
            province,
            activeSOS,
            totalShelters,
            peopleSheltered,
            activeTeams,
            activeAlerts,
            totalDistricts: districtIds.length,
            criticalDistricts,
        };
    }

    // ==================== DISTRICTS ====================

    async getAllDistricts(user: User, provinceId?: number, riskLevel?: string) {
        const where: any = {};

        if (provinceId) {
            where.provinceId = provinceId;
        }

        if (riskLevel) {
            where.riskLevel = riskLevel;
        }

        return await this.districtRepository.find({
            where,
            order: { name: 'ASC' },
            relations: ['province'],
        });
    }

    async getDistrictById(id: number, user: User) {
        const district = await this.districtRepository.findOne({
            where: { id },
            relations: ['province'],
        });

        if (!district) {
            throw new NotFoundException(`District with ID ${id} not found`);
        }

        return district;
    }

    // ==================== ALERTS ====================

    async getAllAlerts(user: User, status?: string, severity?: string, provinceId?: number) {
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (severity) {
            where.severity = severity;
        }

        if (provinceId) {
            where.provinceId = provinceId;
        }

        return await this.alertRepository.find({
            where,
            order: { createdAt: 'DESC' },
        });
    }

    async createAlert(createAlertDto: CreateAlertDto, user: User) {
        const alertData: Partial<Alert> = {
            title: createAlertDto.title,
            type: createAlertDto.type,
            alertType: createAlertDto.alertType,
            severity: createAlertDto.severity || AlertSeverity.MEDIUM,
            description: createAlertDto.description,
            message: createAlertDto.message,
            affectedAreas: createAlertDto.affectedAreas,
            provinceId: createAlertDto.provinceId,
            districtId: createAlertDto.districtId,
            province: createAlertDto.province,
            district: createAlertDto.district,
            issuedBy: user.name,
            issuedByUserId: user.id,
            status: AlertStatus.ACTIVE,
            source: 'NDMA',
        };

        const alert = this.alertRepository.create(alertData);
        const savedAlert = await this.alertRepository.save(alert);

        await this.logActivity(
            'alert_created',
            'National Alert Created',
            `NDMA ${user.name} created national alert: ${savedAlert.title}`,
            user.id,
            createAlertDto.provinceId,
        );

        return savedAlert;
    }

    async resolveAlert(id: number, user: User) {
        const alert = await this.alertRepository.findOne({
            where: { id },
        });

        if (!alert) {
            throw new NotFoundException('Alert not found');
        }

        alert.status = AlertStatus.RESOLVED;
        alert.resolvedAt = new Date();

        const updated = await this.alertRepository.save(alert);

        await this.logActivity(
            'alert_resolved',
            'Alert Resolved',
            `NDMA ${user.name} resolved alert: ${alert.title}`,
            user.id,
            alert.provinceId,
        );

        return updated;
    }

    async deleteAlert(id: number, user: User) {
        const alert = await this.alertRepository.findOne({
            where: { id },
        });

        if (!alert) {
            throw new NotFoundException('Alert not found');
        }

        await this.alertRepository.remove(alert);

        await this.logActivity(
            'alert_deleted',
            'Alert Deleted',
            `NDMA ${user.name} deleted alert: ${alert.title}`,
            user.id,
        );

        return { message: 'Alert deleted successfully' };
    }

    // ==================== SHELTERS ====================

    async getAllShelters(user: User, status?: string, provinceId?: number) {
        const qb = this.shelterRepository
            .createQueryBuilder('shelter')
            .leftJoinAndSelect('shelter.district', 'district')
            .where('shelter.is_deleted = false');

        if (status) {
            qb.andWhere('shelter.status = :status', { status });
        }

        if (provinceId) {
            const districts = await this.districtRepository.find({
                where: { provinceId },
                select: ['id'],
            });
            const districtIds = districts.map(d => d.id);
            if (districtIds.length > 0) {
                qb.andWhere('shelter.district_id IN (:...districtIds)', { districtIds });
            } else {
                return [];
            }
        }

        return await qb.orderBy('shelter.name', 'ASC').getMany();
    }

    async getShelterStats(user: User) {
        const stats = await this.shelterRepository
            .createQueryBuilder('shelter')
            .select('COUNT(*)', 'totalShelters')
            .addSelect('COALESCE(SUM(shelter.capacity), 0)', 'totalCapacity')
            .addSelect('COALESCE(SUM(shelter.occupancy), 0)', 'currentOccupancy')
            .where('shelter.is_deleted = false')
            .getRawOne();

        const totalShelters = parseInt(stats.totalShelters);
        const totalCapacity = parseInt(stats.totalCapacity);
        const currentOccupancy = parseInt(stats.currentOccupancy);
        const avgOccupancyPercent = totalCapacity > 0 ? Math.round((currentOccupancy / totalCapacity) * 100) : 0;

        // Get shelter breakdown by status
        const byStatus = await this.shelterRepository
            .createQueryBuilder('shelter')
            .select('shelter.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where('shelter.is_deleted = false')
            .groupBy('shelter.status')
            .getRawMany();

        return {
            totalShelters,
            totalCapacity,
            currentOccupancy,
            availableCapacity: totalCapacity - currentOccupancy,
            avgOccupancyPercent,
            byStatus,
        };
    }

    // ==================== RESOURCES ====================

    async getAllResources(user: User, status?: string, type?: string) {
        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (type) {
            where.type = type;
        }

        return await this.resourceRepository.find({
            where,
            order: { name: 'ASC' },
        });
    }

    async getResourceStats(user: User) {
        // Only count NATIONAL-LEVEL resources (no province, district, or shelter assignment)
        const stats = await this.resourceRepository
            .createQueryBuilder('resource')
            .select('COUNT(*)', 'totalResources')
            .addSelect('COALESCE(SUM(resource.quantity), 0)', 'totalQuantity')
            .addSelect('COALESCE(SUM(resource.allocated), 0)', 'totalAllocated')
            .where('resource.province_id IS NULL')
            .andWhere('resource.district_id IS NULL')
            .andWhere('resource.shelter_id IS NULL')
            .getRawOne();

        const totalResources = parseInt(stats.totalResources);
        const totalQuantity = parseInt(stats.totalQuantity);
        const totalAllocated = parseInt(stats.totalAllocated);
        const availableQuantity = totalQuantity - totalAllocated;
        const allocatedPercent = totalQuantity > 0 ? Math.round((totalAllocated / totalQuantity) * 100) : 0;

        // Get by type breakdown with allocated amounts - ONLY national level
        const byType = await this.resourceRepository
            .createQueryBuilder('resource')
            .select('resource.type', 'type')
            .addSelect('COUNT(*)', 'count')
            .addSelect('COALESCE(SUM(resource.quantity), 0)', 'quantity')
            .addSelect('COALESCE(SUM(resource.allocated), 0)', 'allocated')
            .where('resource.province_id IS NULL')
            .andWhere('resource.district_id IS NULL')
            .andWhere('resource.shelter_id IS NULL')
            .groupBy('resource.type')
            .getRawMany();

        return {
            totalResources,
            totalQuantity,
            totalAllocated,
            availableQuantity,
            allocatedPercent,
            byType,
        };
    }

    async getResourcesByProvince(user: User) {
        const provinces = await this.provinceRepository.find();

        const result = await Promise.all(
            provinces.map(async (province) => {
                const resources = await this.resourceRepository.find({
                    where: { 
                        provinceId: province.id,
                        districtId: IsNull(), // Only province-level resources
                    },
                });

                // Group resources by type
                const byType = {
                    food: 0,
                    water: 0,
                    medical: 0,
                    shelter: 0,
                };

                resources.forEach(resource => {
                    const type = (resource.type || resource.resourceType || '').toLowerCase();
                    if (type.includes('food')) {
                        byType.food += resource.quantity || 0;
                    } else if (type.includes('water')) {
                        byType.water += resource.quantity || 0;
                    } else if (type.includes('medical')) {
                        byType.medical += resource.quantity || 0;
                    } else if (type.includes('shelter')) {
                        byType.shelter += resource.quantity || 0;
                    }
                });

                const totalQuantity = resources.reduce((sum, r) => sum + (r.quantity || 0), 0);
                const totalAllocated = resources.reduce((sum, r) => sum + (r.allocated || 0), 0);

                return {
                    province,
                    provinceName: province.name,
                    resourceCount: resources.length,
                    totalQuantity,
                    totalAllocated,
                    availableQuantity: totalQuantity - totalAllocated,
                    updatedAt: resources.length > 0 ? resources[0].updatedAt : new Date(),
                    resources: byType, // Resource breakdown by type
                };
            }),
        );

        return result;
    }

    // ==================== SOS REQUESTS ====================

    async getAllSosRequests(user: User, status?: string, priority?: string, provinceId?: number) {
        const qb = this.sosRepository
            .createQueryBuilder('sos')
            .leftJoinAndSelect('sos.district', 'district')
            .leftJoinAndSelect('sos.rescueTeam', 'rescueTeam')
            .where('sos.is_deleted = false');

        if (status) {
            qb.andWhere('sos.status = :status', { status });
        }

        if (priority) {
            qb.andWhere('sos.priority = :priority', { priority });
        }

        if (provinceId) {
            const districts = await this.districtRepository.find({
                where: { provinceId },
                select: ['id'],
            });
            const districtIds = districts.map(d => d.id);
            if (districtIds.length > 0) {
                qb.andWhere('sos.district_id IN (:...districtIds)', { districtIds });
            } else {
                return [];
            }
        }

        return await qb.orderBy('sos.created_at', 'DESC').getMany();
    }

    async getSosStats(user: User) {
        const [pending, assigned, inProgress, completed, total] = await Promise.all([
            this.sosRepository.count({ where: { status: SosStatus.PENDING, isDeleted: false } }),
            this.sosRepository.count({ where: { status: SosStatus.ASSIGNED, isDeleted: false } }),
            this.sosRepository.count({ where: { status: SosStatus.IN_PROGRESS, isDeleted: false } }),
            this.sosRepository.count({ where: { status: SosStatus.COMPLETED, isDeleted: false } }),
            this.sosRepository.count({ where: { isDeleted: false } }),
        ]);

        // Get by priority
        const byPriority = await this.sosRepository
            .createQueryBuilder('sos')
            .select('sos.priority', 'priority')
            .addSelect('COUNT(*)', 'count')
            .where('sos.is_deleted = false')
            .andWhere('sos.status IN (:...statuses)', { statuses: ['Pending', 'Assigned', 'En-route', 'In Progress'] })
            .groupBy('sos.priority')
            .getRawMany();

        return {
            pending,
            assigned,
            inProgress,
            completed,
            total,
            active: pending + assigned + inProgress,
            byPriority,
        };
    }

    async getSosRequestById(id: string, user: User) {
        const sosRequest = await this.sosRepository.findOne({
            where: { id, isDeleted: false },
            relations: ['district', 'rescueTeam'],
        });

        if (!sosRequest) {
            throw new NotFoundException('SOS request not found');
        }

        return sosRequest;
    }

    // ==================== RESCUE TEAMS ====================

    async getAllRescueTeams(user: User, status?: string, provinceId?: number) {
        const qb = this.rescueTeamRepository
            .createQueryBuilder('team')
            .leftJoinAndSelect('team.district', 'district')
            .where('team.is_deleted = false');

        if (status) {
            qb.andWhere('team.status = :status', { status });
        }

        if (provinceId) {
            const districts = await this.districtRepository.find({
                where: { provinceId },
                select: ['id'],
            });
            const districtIds = districts.map(d => d.id);
            if (districtIds.length > 0) {
                qb.andWhere('team.district_id IN (:...districtIds)', { districtIds });
            } else {
                return [];
            }
        }

        return await qb.orderBy('team.name', 'ASC').getMany();
    }

    async getRescueTeamStats(user: User) {
        const [available, deployed, onMission, total] = await Promise.all([
            this.rescueTeamRepository.count({ where: { status: RescueTeamStatus.AVAILABLE, isDeleted: false } }),
            this.rescueTeamRepository.count({ where: { status: RescueTeamStatus.DEPLOYED, isDeleted: false } }),
            this.rescueTeamRepository.count({ where: { status: RescueTeamStatus.ON_MISSION, isDeleted: false } }),
            this.rescueTeamRepository.count({ where: { isDeleted: false } }),
        ]);

        // By type breakdown
        const byType = await this.rescueTeamRepository
            .createQueryBuilder('team')
            .select('team.type', 'type')
            .addSelect('COUNT(*)', 'count')
            .where('team.is_deleted = false')
            .groupBy('team.type')
            .getRawMany();

        return {
            available,
            deployed,
            onMission,
            total,
            active: deployed + onMission,
            byType,
        };
    }

    // ==================== ACTIVITY LOGS ====================

    async getActivityLogs(user: User, limit: number = 100, type?: string) {
        const where: any = {};

        if (type) {
            where.activityType = type;
        }

        return await this.activityLogRepository.find({
            where,
            order: { createdAt: 'DESC' },
            take: limit,
        });
    }

    // ==================== FLOOD ZONES ====================

    async getFloodZones(user: User) {
        // Get districts with risk levels for flood zone visualization
        const districts = await this.districtRepository.find({
            relations: ['province'],
            order: { riskLevel: 'ASC' },
        });

        return districts.map(d => ({
            id: d.id,
            name: d.name,
            province: d.province?.name,
            riskLevel: d.riskLevel,
            status: d.status,
            population: d.population,
        }));
    }

    // ==================== MAP DATA ====================

    async getMapData(user: User) {
        const [districts, shelters, sosRequests, alerts] = await Promise.all([
            this.districtRepository.find({ relations: ['province'] }),
            this.shelterRepository.find({ where: { isDeleted: false } }),
            this.sosRepository.find({
                where: { isDeleted: false, status: In(['Pending', 'Assigned', 'En-route', 'In Progress']) },
            }),
            this.alertRepository.find({ where: { status: AlertStatus.ACTIVE } }),
        ]);

        return {
            districts: districts.map(d => ({
                id: d.id,
                name: d.name,
                province: d.province?.name,
                riskLevel: d.riskLevel,
                sosCount: d.sosRequests,
                activeAlerts: d.activeAlerts,
            })),
            shelters: shelters.map(s => ({
                id: s.id,
                name: s.name,
                lat: s.lat,
                lng: s.lng,
                status: s.status,
                capacity: s.capacity,
                occupancy: s.occupancy,
            })),
            activeSOSCount: sosRequests.length,
            activeAlertCount: alerts.length,
        };
    }

    async getMapProvinceData(user: User) {
        const provinces = await this.provinceRepository.find();

        // Return provinces with LOW risk by default
        // This ensures clean slate for ML predictions to show dramatic changes
        const provinceData = provinces.map(province => {
            return {
                id: province.id,
                name: province.name,
                code: province.code,
                districtCount: 0,
                criticalDistricts: 0,
                highRiskDistricts: 0,
                overallRisk: 'low', // Always start with LOW risk for ML visualization
            };
        });

        return provinceData;
    }

    // ==================== RESOURCE MANAGEMENT ====================

    /**
     * Create a national-level resource
     * NDMA resources have province_id = NULL
     */
    async createNationalResource(createDto: CreateNationalResourceDto, user: User): Promise<Resource> {
        const resourceData = {
            name: createDto.name,
            type: createDto.type,
            category: createDto.category,
            quantity: createDto.quantity,
            unit: createDto.unit,
            location: createDto.location || 'National Warehouse Islamabad',
            icon: createDto.icon,
            description: createDto.description,
            provinceId: undefined as number | undefined, // National level
            districtId: undefined as number | undefined,
            status: ResourceStatus.AVAILABLE,
            allocated: 0,
            allocatedQuantity: 0,
        };

        const nationalResource = this.resourceRepository.create(resourceData as any) as unknown as Resource;
        const saved = await this.resourceRepository.save(nationalResource);

        await this.logActivity(
            'resource_created',
            'National Resource Created',
            `NDMA ${user.name} created national resource: ${saved.name} (${saved.quantity} ${saved.unit})`,
            user.id,
        );

        return saved;
    }

    /**
     * Increase stock for a national resource
     */
    async increaseNationalStock(resourceId: number, increaseDto: IncreaseNationalStockDto, user: User) {
        const resource = await this.resourceRepository.findOne({
            where: { id: resourceId, provinceId: IsNull(), districtId: IsNull() },
        });

        if (!resource) {
            throw new NotFoundException('National resource not found');
        }

        resource.quantity += increaseDto.quantity;
        const updated = await this.resourceRepository.save(resource);

        await this.logActivity(
            'resource_stock_increased',
            'National Stock Increased',
            `NDMA ${user.name} increased ${resource.name} stock by ${increaseDto.quantity} ${resource.unit}. ${increaseDto.notes || ''}`,
            user.id,
        );

        return updated;
    }

    /**
     * Allocate national resource to a province (NDMA → PDMA)
     */
    async allocateResourceToProvince(resourceId: number, allocateDto: AllocateResourceToProvinceDto, user: User) {
        // Verify national resource exists
        const nationalResource = await this.resourceRepository.findOne({
            where: { id: resourceId, provinceId: IsNull(), districtId: IsNull() },
        });

        if (!nationalResource) {
            throw new NotFoundException('National resource not found');
        }

        // Verify province exists
        const province = await this.provinceRepository.findOne({
            where: { id: allocateDto.provinceId },
        });

        if (!province) {
            throw new NotFoundException('Province not found');
        }

        // Check available stock
        const available = nationalResource.quantity - nationalResource.allocated;
        if (allocateDto.quantity > available) {
            throw new BadRequestException(
                `Insufficient stock. Only ${available} ${nationalResource.unit} available`
            );
        }

        // Update national resource allocation counter
        nationalResource.allocated += allocateDto.quantity;

        // Update status based on allocation percentage
        const usagePercentage = (nationalResource.allocated / nationalResource.quantity) * 100;
        if (usagePercentage >= 100) {
            nationalResource.status = ResourceStatus.ALLOCATED;
        } else if (usagePercentage >= 90) {
            nationalResource.status = ResourceStatus.CRITICAL;
        } else if (usagePercentage >= 70) {
            nationalResource.status = ResourceStatus.LOW;
        } else {
            nationalResource.status = ResourceStatus.AVAILABLE;
        }

        await this.resourceRepository.save(nationalResource);

        // Create or update province-level resource
        let provinceResource = await this.resourceRepository.findOne({
            where: {
                name: nationalResource.name,
                type: nationalResource.type,
                provinceId: allocateDto.provinceId,
                districtId: IsNull(),
            },
        });

        if (provinceResource) {
            // Add to existing province resource
            provinceResource.quantity += allocateDto.quantity;
            await this.resourceRepository.save(provinceResource);
        } else {
            // Create new province resource
            const newResourceData = {
                name: nationalResource.name,
                icon: nationalResource.icon,
                type: nationalResource.type,
                category: nationalResource.category,
                quantity: allocateDto.quantity,
                unit: nationalResource.unit,
                location: `${province.name} Provincial Warehouse`,
                provinceId: allocateDto.provinceId,
                districtId: undefined as number | undefined,
                status: ResourceStatus.AVAILABLE,
                allocated: 0,
                allocatedQuantity: 0,
                description: allocateDto.purpose || nationalResource.description,
            };
            provinceResource = this.resourceRepository.create(newResourceData as any) as unknown as Resource;
            await this.resourceRepository.save(provinceResource);
        }

        const savedProvinceResource = provinceResource;

        // Create NDMA allocation record
        const allocation = this.ndmaAllocationRepository.create({
            resourceId: nationalResource.id,
            resourceType: nationalResource.type,
            resourceName: nationalResource.name,
            provinceId: allocateDto.provinceId,
            quantity: allocateDto.quantity,
            unit: nationalResource.unit,
            status: NdmaAllocationStatus.DELIVERED,
            priority: allocateDto.priority || 'normal',
            purpose: allocateDto.purpose,
            notes: allocateDto.notes,
            allocatedByUserId: user.id,
            allocatedByName: user.name,
        });

        await this.ndmaAllocationRepository.save(allocation);

        await this.logActivity(
            'resource_allocated_to_province',
            'Resource Allocated to Province',
            `NDMA ${user.name} allocated ${allocateDto.quantity} ${nationalResource.unit} of ${nationalResource.name} to ${province.name}`,
            user.id,
            allocateDto.provinceId,
        );

        return {
            nationalResource,
            provinceResource: savedProvinceResource,
            allocation,
            message: `Successfully allocated ${allocateDto.quantity} ${nationalResource.unit} of ${nationalResource.name} to ${province.name}`,
        };
    }

    /**
     * Allocate resource by type (auto-creates national resource if needed)
     * This is used for manual allocation from the UI when selecting resource types
     */
    async allocateResourceByType(allocateDto: AllocateResourceToProvinceDto & { resourceType: string }, user: User) {
        // Find or create national resource by type
        let nationalResource = await this.resourceRepository.findOne({
            where: {
                type: allocateDto.resourceType,
                provinceId: IsNull(),
                districtId: IsNull(),
            },
        });

        // If national resource doesn't exist, create it with default values
        if (!nationalResource) {
            const resourceDefaults = {
                food: { name: 'Food Supplies', unit: 'tons', quantity: 100000, icon: 'package' },
                water: { name: 'Water', unit: 'liters', quantity: 500000, icon: 'droplets' },
                medical: { name: 'Medical Supplies', unit: 'kits', quantity: 50000, icon: 'stethoscope' },
                shelter: { name: 'Shelter Materials', unit: 'units', quantity: 20000, icon: 'home' },
            };

            const defaults = resourceDefaults[allocateDto.resourceType.toLowerCase()] || {
                name: `${allocateDto.resourceType} Resources`,
                unit: 'units',
                quantity: 10000,
                icon: 'package'
            };

            const newResource = this.resourceRepository.create({
                name: defaults.name,
                type: allocateDto.resourceType,
                category: allocateDto.resourceType,
                resourceType: allocateDto.resourceType,
                quantity: defaults.quantity,
                unit: defaults.unit,
                icon: defaults.icon,
                location: 'National Warehouse Islamabad',
                status: ResourceStatus.AVAILABLE,
                allocated: 0,
                allocatedQuantity: 0,
                description: `Auto-created national ${allocateDto.resourceType} stock`,
            });

            nationalResource = await this.resourceRepository.save(newResource);

            await this.logActivity(
                'resource_created',
                'National Resource Auto-Created',
                `System auto-created national resource: ${nationalResource.name} for allocation`,
                user.id,
            );
        }

        // Now allocate using the existing method
        return await this.allocateResourceToProvince(nationalResource.id, allocateDto, user);
    }

    /**
     * Get resource requests from provinces (PDMA requests)
     */
    async getResourceRequests(user: User, status?: string) {
        const where: any = {};

        if (status) {
            where.status = status;
        }

        const requests = await this.resourceRequestRepository.find({
            where,
            order: { createdAt: 'DESC' },
            relations: ['province', 'requestedByUser'],
        });

        return requests;
    }

    /**
     * Review (Approve/Reject) a resource request from PDMA
     */
    async reviewResourceRequest(requestId: number, reviewDto: ReviewResourceRequestDto, user: User) {
        const request = await this.resourceRequestRepository.findOne({
            where: { id: requestId },
            relations: ['province'],
        });

        if (!request) {
            throw new NotFoundException('Resource request not found');
        }

        if (request.status !== ResourceRequestStatus.PENDING) {
            throw new BadRequestException('Request already processed');
        }

        request.status = reviewDto.status;
        request.processedByUserId = user.id;
        request.processedByName = user.name;
        request.processedAt = new Date();

        if (reviewDto.approvedItems) {
            request.approvedItems = reviewDto.approvedItems;
        }

        await this.resourceRequestRepository.save(request);

        // If approved, create allocations
        if (reviewDto.status === ResourceRequestStatus.APPROVED && reviewDto.approvedItems) {
            for (const item of reviewDto.approvedItems) {
                // Find national resource
                const nationalResource = await this.resourceRepository.findOne({
                    where: {
                        type: item.resourceType,
                        provinceId: IsNull(),
                        districtId: IsNull(),
                    },
                });

                if (nationalResource) {
                    // Allocate to province
                    await this.allocateResourceToProvince(
                        nationalResource.id,
                        {
                            provinceId: request.provinceId,
                            quantity: item.quantity,
                            purpose: request.reason,
                            notes: `Approved from request #${requestId}`,
                        },
                        user,
                    );
                }
            }
        }

        await this.logActivity(
            'resource_request_reviewed',
            'Resource Request Reviewed',
            `NDMA ${user.name} ${reviewDto.status} resource request from ${request.province.name}`,
            user.id,
            request.provinceId,
        );

        return request;
    }

    /**
     * Core national resource defaults for 4-level hierarchy treasury
     */
    private readonly NATIONAL_TREASURY_DEFAULTS = [
        {
            type: 'food',
            name: 'Food Supplies',
            category: 'food',
            resourceType: 'food',
            quantity: 100000,
            unit: 'tons',
            icon: 'package',
            description: 'National food supply reserve',
            location: 'National Warehouse Islamabad',
        },
        {
            type: 'water',
            name: 'Water Supply',
            category: 'water',
            resourceType: 'water',
            quantity: 500000,
            unit: 'liters',
            icon: 'droplets',
            description: 'National water reserve',
            location: 'National Warehouse Islamabad',
        },
        {
            type: 'medical',
            name: 'Medical Supplies',
            category: 'medical',
            resourceType: 'medical',
            quantity: 50000,
            unit: 'kits',
            icon: 'stethoscope',
            description: 'National medical supplies reserve',
            location: 'National Warehouse Islamabad',
        },
        {
            type: 'shelter',
            name: 'Shelter Materials',
            category: 'shelter',
            resourceType: 'shelter',
            quantity: 20000,
            unit: 'units',
            icon: 'home',
            description: 'National shelter materials reserve',
            location: 'National Warehouse Islamabad',
        },
    ];

    /**
     * Get national resources only (province_id = NULL)
     * Auto-initializes the 4 core treasury resources if they don't exist
     */
    async getNationalResources(user: User) {
        // Check existing national resources
        let nationalResources = await this.resourceRepository.find({
            where: { provinceId: IsNull(), districtId: IsNull(), shelterId: IsNull() },
            order: { type: 'ASC', name: 'ASC' },
        });

        // Auto-initialize treasury if empty or missing core types
        const existingTypes = nationalResources.map(r => r.type?.toLowerCase());
        const coreTypes = ['food', 'water', 'medical', 'shelter'];
        const missingTypes = coreTypes.filter(t => !existingTypes.includes(t));

        if (missingTypes.length > 0) {
            console.log(`[NDMA Treasury] Initializing missing core resources: ${missingTypes.join(', ')}`);

            for (const defaults of this.NATIONAL_TREASURY_DEFAULTS) {
                if (missingTypes.includes(defaults.type)) {
                    const newResource = this.resourceRepository.create({
                        ...defaults,
                        provinceId: null as any,
                        districtId: null as any,
                        shelterId: null as any,
                        status: ResourceStatus.AVAILABLE,
                        allocated: 0,
                        allocatedQuantity: 0,
                    });
                    await this.resourceRepository.save(newResource);
                }
            }

            // Refetch with newly created resources
            nationalResources = await this.resourceRepository.find({
                where: { provinceId: IsNull(), districtId: IsNull(), shelterId: IsNull() },
                order: { type: 'ASC', name: 'ASC' },
            });

            // Log treasury initialization
            await this.logActivity(
                'treasury_initialized',
                'National Treasury Initialized',
                `System auto-initialized national treasury with core resources: ${missingTypes.join(', ')}`,
                user.id,
            );
        }

        // Return with computed available quantities
        return nationalResources.map(resource => ({
            ...resource,
            available: resource.quantity,
            allocated: resource.allocated || 0,
            remaining: resource.quantity - (resource.allocated || 0),
        }));
    }

    /**
     * Get NDMA allocation history
     */
    async getNdmaAllocationHistory(user: User, provinceId?: number) {
        const where: any = {};

        if (provinceId) {
            where.provinceId = provinceId;
        }

        return await this.ndmaAllocationRepository.find({
            where,
            order: { allocatedAt: 'DESC' },
            relations: ['province', 'resource'],
            take: 100,
        });
    }
}
