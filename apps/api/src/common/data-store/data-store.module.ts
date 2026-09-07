import { Module, Global } from '@nestjs/common';
import { DataStoreService } from './data-store.service';
import { PrismaService } from '../prisma/prisma.service';

@Global()
@Module({
  providers: [DataStoreService, PrismaService],
  exports: [DataStoreService, PrismaService],
})
export class DataStoreModule {}
