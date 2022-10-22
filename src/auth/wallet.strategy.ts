import { Strategy } from 'passport-custom';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Auth } from '@prisma/client';
import { AuthService } from './auth.service';

@Injectable()
export class WalletStrategy extends PassportStrategy(Strategy, "wallet") {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req): Promise<Auth> {
    const { address, signature } = req.body;
    const auth = await this.authService.validateAuth(address, signature);
    if (auth) {
      return { ...auth };
    }
    throw new UnauthorizedException();
  }
}
