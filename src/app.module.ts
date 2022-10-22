import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AccountModule } from './account/account.module';
import { PrismaModule } from './prisma/prisma.module';
import { KartModule } from './kart/kart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule, 
    AccountModule, 
    PrismaModule, 
    KartModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {}
