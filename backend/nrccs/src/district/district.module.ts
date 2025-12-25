import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { User } from '../common/entities/user.entity';
import { Province } from '../common/entities/province.entity';
import { District } from '../common/entities/district.entity';
import { Shelter } from '../common/entities/shelter.entity';
import { Alert } from '../common/entities/alert.entity';
import { Resource } from '../common/entities/resource.entity';
import { SosRequest } from '../common/entities/sos-request.entity';
import { RescueTeam } from '../common/entities/rescue-team.entity';
import { ActivityLog } from '../common/entities/activity-log.entity';
import { DamageReport } from '../common/entities/damage-report.entity';
import { SosRequestTimeline } from '../common/entities/sos-request-timeline.entity';
import { WeatherData } from '../common/entities/weather-data.entity';
import { ResourceAllocation } from '../common/entities/resource-allocation.entity';

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
      DamageReport,
      SosRequestTimeline,
      WeatherData,
      ResourceAllocation,
    ]),
  ],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: [DistrictService],
})
export class DistrictModule {}
