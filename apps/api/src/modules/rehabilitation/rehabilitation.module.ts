import { Module } from '@nestjs/common';
import { RehabilitationController } from './rehabilitation.controller';
import { RehabilitationService } from './rehabilitation.service';

@Module({
  controllers: [RehabilitationController],
  providers: [RehabilitationService],
  exports: [RehabilitationService],
})
export class RehabilitationModule {}
