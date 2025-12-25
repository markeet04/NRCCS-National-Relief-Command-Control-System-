import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistrictController } from './district.controller';
import { DistrictService } from './district.service';
import { MissingPerson } from '../common/entities/missing-person.entity';
import { District } from '../common/entities/district.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MissingPerson,
            District,
        ]),
    ],
    controllers: [DistrictController],
    providers: [DistrictService],
    exports: [DistrictService],
})
export class DistrictModule { }
