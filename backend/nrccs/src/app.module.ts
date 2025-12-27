
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SuperadminModule } from './superadmin/superadmin.module';
import { PdmaModule } from './pdma/pdma.module';
import { DistrictModule } from './district/district.module';
import { CivilianModule } from './civilian/civilian.module';
import { NdmaModule } from './ndma/ndma.module';
import { ReasoningModule } from './reasoning/reasoning.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(), // Enable cron jobs
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false, // NEVER use true in production
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    AuthModule,
    SuperadminModule,
    PdmaModule,
    DistrictModule,
    CivilianModule,
    NdmaModule,  // NDMA Dashboard module
    ReasoningModule,  // AI Deductive Reasoning module
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
