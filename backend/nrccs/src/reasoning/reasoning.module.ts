import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReasoningService } from './reasoning.service';
import { ReasoningController } from './reasoning.controller';
import { ResourceSuggestion } from './entities/resource-suggestion.entity';
import { RuleEngine } from './rules/rule-engine';
import { District } from '../common/entities/district.entity';
import { Province } from '../common/entities/province.entity';
import { Resource } from '../common/entities/resource.entity';
import { NdmaModule } from '../ndma/ndma.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResourceSuggestion,
      District,
      Province,
      Resource,
    ]),
    forwardRef(() => NdmaModule),
  ],
  providers: [ReasoningService, RuleEngine],
  controllers: [ReasoningController],
  exports: [ReasoningService],
})
export class ReasoningModule {}
