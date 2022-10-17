import { Strategy } from 'passport-custom';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Account } from '@prisma/client';
import { AuthService } from './auth.service';

@Injectable()
export class WalletStrategy extends PassportStrategy(Strategy, "wallet") {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req): Promise<Account> {
    const { address, signature } = req.body;
    const account = await this.authService.validateAccount(address, signature);
    if (account) {
      return {...account, signature};
    }
    throw new UnauthorizedException();
  }
}
