import { Module } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { SignatureController } from './signature.controller';

@Module({
  providers: [SignatureService],
  controllers: [SignatureController]
})
export class SignatureModule {}
