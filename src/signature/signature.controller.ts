import { Controller, Post, Request, BadRequestException, UseGuards } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { AccessTokenGuard } from '../auth/accessToken.guard';

@Controller('signature')
export class SignatureController {
    @UseGuards(AccessTokenGuard)
    @Post('sign')
    sign(@Request() req) {
        const auth: Auth = req.user;
        const { collection, tokenId, price, actionType, signature } = req.body;
        if(!collection || !tokenId || !price || !actionType || !signature) {
            throw new BadRequestException('Missing parameters');
        }

        
    }
}
