import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CivilianController } from './civilian.controller';
import { CivilianService } from './civilian.service';
import { Alert } from '../common/entities/alert.entity';
import { Shelter } from '../common/entities/shelter.entity';
import { SosRequest } from '../common/entities/sos-request.entity';
import { MissingPerson } from '../common/entities/missing-person.entity';
import { Province } from '../common/entities/province.entity';
import { District } from '../common/entities/district.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Alert,
            Shelter,
            SosRequest,
            MissingPerson,
            Province,
            District,
        ]),
    ],
    controllers: [CivilianController],
    providers: [CivilianService],
})
export class CivilianModule { }
