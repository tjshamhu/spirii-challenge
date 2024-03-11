import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AggregationEntity } from './data/entities/aggregation.entity';
import { LogEntity } from './data/entities/log.entity';
import { ExternalDataModule } from './external-data/external-data.module';
import { AggregationModule } from './aggregation/aggregation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/sql',
      synchronize: true,
      entities: [AggregationEntity, LogEntity],
    }),
    AggregationModule,
    ExternalDataModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([AggregationEntity, LogEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
