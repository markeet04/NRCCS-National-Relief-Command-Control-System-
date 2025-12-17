import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';
import { User } from '../common/entities/user.entity';
import { AuditLog } from '../common/entities/audit-log.entity';
import { ActivityLog } from '../common/entities/activity-log.entity';
import { Province } from '../common/entities/province.entity';
import { District } from '../common/entities/district.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      AuditLog,
      ActivityLog,
      Province,
      District,
    ]),
  ],
  controllers: [SuperadminController],
  providers: [SuperadminService],
  exports: [SuperadminService],
})
export class SuperadminModule {}
