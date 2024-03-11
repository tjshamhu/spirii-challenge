import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AggregationEntity } from '../data/entities/aggregation.entity';
import { ExternalDataModule } from '../external-data/external-data.module';
import { AggregationService } from './aggregation.service';
import { AggregationController } from './aggregation.controller';

@Module({
  providers: [AggregationService],
  controllers: [AggregationController],
  imports: [ExternalDataModule, TypeOrmModule.forFeature([AggregationEntity])],
})
export class AggregationModule {}
