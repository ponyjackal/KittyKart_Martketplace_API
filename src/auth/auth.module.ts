import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './accessToken.strategy';
import { RefreshTokenStrategy } from './refreshToken.strategy';
import { WalletStrategy } from './wallet.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({})
  ],
  providers: [
    AuthService, 
    PrismaService,
    AccessTokenStrategy, 
    RefreshTokenStrategy, 
    WalletStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
