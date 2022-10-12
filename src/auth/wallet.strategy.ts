import { Strategy } from 'passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Injectable()
export class WalletStrategy extends PassportStrategy(Strategy, "wallet") {
  constructor(private authService: AuthService) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(req, address, signature): Promise<boolean> {
    const user = await this.authService.validateAccount(address, signature);
    if (user) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
