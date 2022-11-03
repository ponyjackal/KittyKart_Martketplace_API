import {
  Controller,
  Request,
  Get,
  Post,
  Param,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { Auth } from '@prisma/client';
import { AuthService } from './auth.service';
import { WalletGuard } from './wallet.guard';
import { RefreshTokenGuard } from './refreshToken.guard';
import { AccessTokenGuard } from './accessToken.guard';
import { Public } from '../app.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(WalletGuard)
  async login(@Request() req, @Res() res: Response) {
    const auth: Auth = req.user;
    // generate jwt token
    const token = await this.authService.login(auth);
    // update nonce
    await this.authService.updateNonce(auth.address);

    return res.status(HttpStatus.OK).json(token);
  }

  @Get(':address')
  @Public()
  findOne(@Param('address') address: string) {
    return this.authService.findOne(address);
  }

  @Post('/signature')
  @Public()
  async getSignature(@Request() req, @Res() res: Response) {
    const privateKey = req.body.privateKey;
    const signature = await this.authService.getSignature(privateKey);
    return res.status(HttpStatus.OK).json({ signature });
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  logout(@Request() req) {
    const auth: Auth = req.user;
    this.authService.logout(auth.address);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refreshTokens(@Request() req) {
    const auth: Auth = req.user;
    const refreshToken = auth.refreshToken;
    return this.authService.refreshTokens(auth.address, refreshToken);
  }
}
