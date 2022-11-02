import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ContractModule } from '../contract/contract.module';

@Module({
  imports: [PrismaModule, ContractModule],
  providers: [CollectionService],
  controllers: [CollectionController],
  exports: [CollectionService],
})
export class CollectionModule {}
