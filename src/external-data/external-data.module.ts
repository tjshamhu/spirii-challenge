import { Module } from '@nestjs/common';
import { ExternalDataService } from './external-data.service';

@Module({
  providers: [ExternalDataService],
  exports: [ExternalDataService]
})
export class ExternalDataModule {}
