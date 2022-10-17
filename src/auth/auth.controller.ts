import { Controller, Request, Post, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Account } from '@prisma/client';
import { AuthService } from './auth.service';
import { AccountService } from '../account/account.service';
import { Public } from '../app.decorator';
import { WalletGuard } from './wallet.guard';
import { RefreshTokenGuard } from './refreshToken.guard';
import { AccessTokenGuard } from './accessToken.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private accountService: AccountService
    ) {}

    @Post('login')
    @UseGuards(WalletGuard)
    async login(@Request() req, @Res() res: Response){
        const account: Account = req.user;
        // generate jwt token
        const token = await this.authService.login(account);
        // update nonce
        await this.accountService.updateNonce(account.address);
        // update signature
        await this.accountService.updateSignature(account.address, account.signature);

        return res.status(HttpStatus.OK).json(token);
    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
    logout(@Request() req) {
        const account: Account = req.user;
        this.authService.logout(account);
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    refreshTokens(@Request() req) {
        const account: Account = req.user;
        const refreshToken = account.refreshToken;
        return this.authService.refreshTokens(account.address, refreshToken);
    }
}
