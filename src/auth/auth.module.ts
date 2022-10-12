import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccountModule } from '../account/account.module';
import { JwtStrategy } from './jwt.strategy';
import { WalletStrategy } from './wallet.strategy';

@Module({
  imports: [
    PassportModule,
    AccountModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '600s' },
    })
  ],
  providers: [AuthService, JwtStrategy, WalletStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
