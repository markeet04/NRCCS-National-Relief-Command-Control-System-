import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MissingPersonStatus } from '../../common/entities/missing-person.entity';

export class UpdateMissingPersonStatusDto {
    @IsEnum(MissingPersonStatus, {
        message: 'Status must be one of: active, found, dead, closed',
    })
    status: MissingPersonStatus;

    @IsOptional()
    @IsString()
    notes?: string;
}
