import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PdmaController } from './pdma.controller';
import { PdmaService } from './pdma.service';
import { User } from '../common/entities/user.entity';
import { Province } from '../common/entities/province.entity';
import { District } from '../common/entities/district.entity';
import { Shelter } from '../common/entities/shelter.entity';
import { Alert } from '../common/entities/alert.entity';
import { Resource } from '../common/entities/resource.entity';
import { SosRequest } from '../common/entities/sos-request.entity';
import { RescueTeam } from '../common/entities/rescue-team.entity';
import { ActivityLog } from '../common/entities/activity-log.entity';
import { AuditLog } from '../common/entities/audit-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Province,
      District,
      Shelter,
      Alert,
      Resource,
      SosRequest,
      RescueTeam,
      ActivityLog,
      AuditLog,
    ]),
  ],
  controllers: [PdmaController],
  providers: [PdmaService],
  exports: [PdmaService],
})
export class PdmaModule {}
