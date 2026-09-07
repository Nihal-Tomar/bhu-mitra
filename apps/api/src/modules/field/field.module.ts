import { Module } from '@nestjs/common';
import { FieldController } from './field.controller';
import { FieldService } from './field.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FieldController],
  providers: [FieldService],
  exports: [FieldService],
})
export class FieldModule {}
