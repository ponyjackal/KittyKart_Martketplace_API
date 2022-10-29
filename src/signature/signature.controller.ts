import { Controller, Post, Request, Body, BadRequestException, UseGuards } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { AccessTokenGuard } from '../auth/accessToken.guard';
import { CreateSignatureDto } from './dto/create-signature.dto';

@Controller('signature')
export class SignatureController {

    @UseGuards(AccessTokenGuard)
    @Post('create')
    create(@Request() req, @Body() createSignatureDto: CreateSignatureDto) {
        const auth: Auth = req.user;

    }
}
