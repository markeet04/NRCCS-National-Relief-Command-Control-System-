import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ReasoningService } from './reasoning.service';
import { GenerateSuggestionsDto } from './dtos/generate-suggestions.dto';
import { RejectSuggestionDto } from './dtos/review-suggestion.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../common/entities/user.entity';
import { SuggestionStatus } from './entities/resource-suggestion.entity';

@Controller('reasoning')
@UseGuards(SessionAuthGuard, RolesGuard)
export class ReasoningController {
  constructor(private reasoningService: ReasoningService) {}

  @Post('suggestions/generate')
  @Roles(UserRole.NDMA)
  async generateSuggestions(
    @Body() dto: GenerateSuggestionsDto,
    @CurrentUser() user: User,
  ) {
    return this.reasoningService.processMLPrediction(
      dto.mlPrediction,
      dto.provinceId,
      user.id,
    );
  }

  @Get('suggestions')
  @Roles(UserRole.NDMA)
  async getSuggestions(
    @Query('status') status?: SuggestionStatus,
    @Query('provinceId') provinceId?: number,
    @Query('resourceType') resourceType?: string,
  ) {
    return this.reasoningService.getSuggestions({
      status,
      provinceId: provinceId ? Number(provinceId) : undefined,
      resourceType,
    });
  }

  @Get('suggestions/stats')
  @Roles(UserRole.NDMA)
  async getStats() {
    return this.reasoningService.getStats();
  }

  @Get('suggestions/:id')
  @Roles(UserRole.NDMA)
  async getSuggestionById(@Param('id', ParseIntPipe) id: number) {
    return this.reasoningService.getSuggestionById(id);
  }

  @Post('suggestions/:id/approve')
  @Roles(UserRole.NDMA)
  async approveSuggestion(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return this.reasoningService.approveSuggestion(id, user);
  }

  @Post('suggestions/:id/reject')
  @Roles(UserRole.NDMA)
  async rejectSuggestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RejectSuggestionDto,
    @CurrentUser() user: User,
  ) {
    return this.reasoningService.rejectSuggestion(id, user.id, dto.reason);
  }
}
