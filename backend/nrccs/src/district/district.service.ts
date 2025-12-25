import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { MissingPerson, MissingPersonStatus } from '../common/entities/missing-person.entity';
import { UpdateMissingPersonStatusDto } from './dtos/update-missing-person-status.dto';

@Injectable()
export class DistrictService {
    constructor(
        @InjectRepository(MissingPerson)
        private missingPersonRepo: Repository<MissingPerson>,
    ) { }

    /**
     * Get all missing persons for a specific district
     */
    async getMissingPersons(districtId: number, filters?: {
        status?: MissingPersonStatus;
        search?: string;
    }) {
        const query = this.missingPersonRepo
            .createQueryBuilder('mp');
        // NOTE: Removed districtId filter - civilians submit reports,
        // so all districts should be able to see and help with any report

        // Filter by status
        if (filters?.status) {
            query.andWhere('mp.status = :status', { status: filters.status });
        }

        // Search by name
        if (filters?.search) {
            query.andWhere('mp.name ILIKE :search', { search: `%${filters.search}%` });
        }

        query.orderBy('mp.reportDate', 'DESC');

        const persons = await query.getMany();

        // Calculate days missing for each person
        return persons.map(person => ({
            ...person,
            daysMissing: this.calculateDaysMissing(person.lastSeenDate),
            shouldBeDeclaredDead: this.shouldBeDeclaredDead(person),
        }));
    }

    /**
     * Update missing person status
     */
    async updateMissingPersonStatus(
        id: number,
        districtId: number,
        dto: UpdateMissingPersonStatusDto,
    ) {
        const person = await this.missingPersonRepo.findOne({ where: { id } });

        if (!person) {
            throw new NotFoundException(`Missing person with ID ${id} not found`);
        }

        // NOTE: Removed district ownership check - any district can help update reports

        // Update status
        person.status = dto.status;

        // Set foundAt timestamp if status is 'found'
        if (dto.status === MissingPersonStatus.FOUND) {
            person.foundAt = new Date();
        }

        await this.missingPersonRepo.save(person);

        return {
            ...person,
            daysMissing: this.calculateDaysMissing(person.lastSeenDate),
        };
    }

    /**
     * Cron job to auto-mark persons as dead after 20 days
     * Runs daily at 2 AM
     */
    @Cron('0 2 * * *')
    async checkAndMarkDeadPersons() {
        const twentyDaysAgo = new Date();
        twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

        const result = await this.missingPersonRepo
            .createQueryBuilder()
            .update(MissingPerson)
            .set({ status: MissingPersonStatus.DEAD })
            .where('status = :status', { status: MissingPersonStatus.ACTIVE })
            .andWhere('lastSeenDate <= :date', { date: twentyDaysAgo })
            .execute();

        console.log(`Auto-declared ${result.affected} missing persons as dead (20+ days missing)`);

        return result.affected;
    }

    /**
     * Calculate days since last seen
     */
    private calculateDaysMissing(lastSeenDate: Date): number {
        if (!lastSeenDate) return 0;

        const now = new Date();
        const lastSeen = new Date(lastSeenDate);
        const diffTime = Math.abs(now.getTime() - lastSeen.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    }

    /**
     * Check if person should be declared dead (20+ days)
     */
    private shouldBeDeclaredDead(person: MissingPerson): boolean {
        if (person.status !== MissingPersonStatus.ACTIVE) return false;

        const daysMissing = this.calculateDaysMissing(person.lastSeenDate);
        return daysMissing >= 20;
    }
}
