import {
  Controller,
  Post,
  Request,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { SignatureService } from './signature.service';
import { AccessTokenGuard } from '../auth/accessToken.guard';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { ApiHeader } from '@nestjs/swagger';

@Controller('signature')
export class SignatureController {
  constructor(private signatureService: SignatureService) {}

  @UseGuards(AccessTokenGuard)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer access_token',
  })
  @Post('create')
  create(@Request() req, @Body() createSignatureDto: CreateSignatureDto) {
    const auth: Auth = req.user;
    return this.signatureService.create(auth.address, createSignatureDto);
  }
}
