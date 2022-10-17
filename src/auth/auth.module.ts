import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../account/account.module';
import { AccessTokenStrategy } from './accessToken.strategy';
import { RefreshTokenStrategy } from './refreshToken.strategy';
import { WalletStrategy } from './wallet.strategy';

@Module({
  imports: [
    PassportModule,
    AccountModule,
    JwtModule.register({})
  ],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy, WalletStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
