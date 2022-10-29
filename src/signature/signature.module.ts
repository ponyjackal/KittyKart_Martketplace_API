import { Module } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { SignatureController } from './signature.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ContractModule } from '../contract/contract.module';

@Module({
  imports: [PrismaModule, ContractModule],
  providers: [SignatureService],
  controllers: [SignatureController]
})
export class SignatureModule {}
