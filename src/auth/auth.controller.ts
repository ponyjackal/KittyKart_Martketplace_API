import { Controller, Request, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Account } from '@prisma/client';
import { AuthService } from './auth.service';
import { AccountService } from '../account/account.service';
import { Public } from '../app.decorator';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private accountService: AccountService
    ) {}

    @Public()
    @Post('login')
    async login(@Request() req, @Res() res: Response){
        const { address, signature } = req.body;
        if(!address || !signature) {
           return res.status(HttpStatus.BAD_REQUEST).send();
        }
        const account: Account | null = await this.authService.validateAccount(address, signature);
        if(!account) {
            return res.status(HttpStatus.BAD_REQUEST).json({error: 'Invalid signature'});
        }
        // generate jwt token
        const token = await this.authService.login(account);
        // update nonce
        await this.accountService.updateNonce(address);
        // update signature
        await this.accountService.updateSignature(address, signature);

        return res.status(HttpStatus.OK).json(token);
    }
}
