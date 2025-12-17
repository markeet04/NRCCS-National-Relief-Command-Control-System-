import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperadminController } from './superadmin.controller';
import { SuperadminService } from './superadmin.service';
import { User } from '../common/entities/user.entity';
import { SystemSettings } from '../common/entities/system-settings.entity';
import { ApiIntegration } from '../common/entities/api-integration.entity';
import { AuditLog } from '../common/entities/audit-log.entity';
import { ActivityLog } from '../common/entities/activity-log.entity';
import { Province } from '../common/entities/province.entity';
import { District } from '../common/entities/district.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      SystemSettings,
      ApiIntegration,
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
