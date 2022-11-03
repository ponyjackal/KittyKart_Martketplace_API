import { Module } from '@nestjs/common';
import { ListingService } from './listing.service';
import { ListingController } from './listing.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ContractModule } from '../contract/contract.module';

@Module({
  imports: [PrismaModule, ContractModule],
  providers: [ListingService],
  controllers: [ListingController],
  exports: [ListingService],
})
export class ListingModule {}
