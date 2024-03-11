import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';
import { ExternalDataModule } from './external-data/external-data.module';

@Module({
  imports: [TransactionModule, ExternalDataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
