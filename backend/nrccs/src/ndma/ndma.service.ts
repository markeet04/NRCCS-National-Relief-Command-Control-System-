import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from '../common/entities/user.entity';
import { Province } from '../common/entities/province.entity';
import { District } from '../common/entities/district.entity';
import { Shelter } from '../common/entities/shelter.entity';
import { Alert, AlertStatus, AlertSeverity } from '../common/entities/alert.entity';
import { Resource } from '../common/entities/resource.entity';
import { SosRequest, SosStatus } from '../common/entities/sos-request.entity';
import { RescueTeam, RescueTeamStatus } from '../common/entities/rescue-team.entity';
import { ActivityLog } from '../common/entities/activity-log.entity';
import { CreateAlertDto } from './dtos/alert.dto';

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
            // Total resource count
            this.resourceRepository
                .createQueryBuilder('resource')
                .select('COALESCE(SUM(resource.quantity), 0)', 'total')
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
        const stats = await this.resourceRepository
            .createQueryBuilder('resource')
            .select('COUNT(*)', 'totalResources')
            .addSelect('COALESCE(SUM(resource.quantity), 0)', 'totalQuantity')
            .addSelect('COALESCE(SUM(resource.allocated), 0)', 'totalAllocated')
            .getRawOne();

        const totalResources = parseInt(stats.totalResources);
        const totalQuantity = parseInt(stats.totalQuantity);
        const totalAllocated = parseInt(stats.totalAllocated);
        const availableQuantity = totalQuantity - totalAllocated;
        const allocatedPercent = totalQuantity > 0 ? Math.round((totalAllocated / totalQuantity) * 100) : 0;

        // Get by type breakdown
        const byType = await this.resourceRepository
            .createQueryBuilder('resource')
            .select('resource.type', 'type')
            .addSelect('COUNT(*)', 'count')
            .addSelect('COALESCE(SUM(resource.quantity), 0)', 'quantity')
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
                    where: { provinceId: province.id },
                });

                const totalQuantity = resources.reduce((sum, r) => sum + (r.quantity || 0), 0);
                const totalAllocated = resources.reduce((sum, r) => sum + (r.allocated || 0), 0);

                return {
                    province,
                    resourceCount: resources.length,
                    totalQuantity,
                    totalAllocated,
                    availableQuantity: totalQuantity - totalAllocated,
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

        const provinceData = await Promise.all(
            provinces.map(async (province) => {
                const districts = await this.districtRepository.find({
                    where: { provinceId: province.id },
                });

                const criticalCount = districts.filter(d => d.riskLevel === 'critical').length;
                const highCount = districts.filter(d => d.riskLevel === 'high').length;

                return {
                    id: province.id,
                    name: province.name,
                    code: province.code,
                    districtCount: districts.length,
                    criticalDistricts: criticalCount,
                    highRiskDistricts: highCount,
                    overallRisk: criticalCount > 0 ? 'critical' : highCount > 0 ? 'high' : 'stable',
                };
            }),
        );

        return provinceData;
    }
}
