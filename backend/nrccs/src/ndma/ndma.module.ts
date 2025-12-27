import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NdmaController } from './ndma.controller';
import { NdmaService } from './ndma.service';
import { FloodPredictionService } from './flood-prediction/flood-prediction.service';
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
import { ResourceRequest } from '../common/entities/resource-request.entity';
import { NdmaResourceAllocation } from '../common/entities/ndma-resource-allocation.entity';
import { ResourceAllocation } from '../common/entities/resource-allocation.entity';
import { ReasoningModule } from '../reasoning/reasoning.module';

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
            ResourceRequest,
            NdmaResourceAllocation,
            ResourceAllocation,
        ]),
        forwardRef(() => ReasoningModule),
    ],
    controllers: [NdmaController],
    providers: [NdmaService, FloodPredictionService],
    exports: [NdmaService, FloodPredictionService],
})
export class NdmaModule { }
