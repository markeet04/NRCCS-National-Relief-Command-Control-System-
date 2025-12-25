import {
    Controller,
    Get,
    Put,
    Param,
    Body,
    Query,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { DistrictService } from './district.service';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/entities/user.entity';
import { MissingPersonStatus } from '../common/entities/missing-person.entity';
import { UpdateMissingPersonStatusDto } from './dtos/update-missing-person-status.dto';

@Controller('district')
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(UserRole.DISTRICT)
export class DistrictController {
    constructor(private readonly districtService: DistrictService) { }

    /**
     * Get all missing persons for the district
     */
    @Get('missing-persons')
    async getMissingPersons(
        @CurrentUser() user: any,
        @Query('status') status?: MissingPersonStatus,
        @Query('search') search?: string,
    ) {
        return this.districtService.getMissingPersons(user.districtId, {
            status,
            search,
        });
    }

    /**
     * Update missing person status
     */
    @Put('missing-persons/:id/status')
    async updateMissingPersonStatus(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: any,
        @Body() dto: UpdateMissingPersonStatusDto,
    ) {
        return this.districtService.updateMissingPersonStatus(
            id,
            user.districtId,
            dto,
        );
    }
}
