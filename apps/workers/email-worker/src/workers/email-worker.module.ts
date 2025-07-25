import { Module } from '@nestjs/common';
import { EmailWorkerController } from './email-worker.controller';
import { EmailWorkerService } from './email-worker.service';

@Module({
  imports: [],
  controllers: [EmailWorkerController],
  providers: [EmailWorkerService],
})
export class EmailWorkerModule {}
