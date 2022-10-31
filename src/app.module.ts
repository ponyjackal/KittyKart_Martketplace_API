import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { PrismaModule } from './prisma/prisma.module';
import { ContractModule } from './contract/contract.module';
import { OfferModule } from './offer/offer.module';
import { ListModule } from './list/listing.module';
import { SignatureModule } from './signature/signature.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    AccountModule,
    PrismaModule,
    ContractModule,
    OfferModule,
    ListModule,
    SignatureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
