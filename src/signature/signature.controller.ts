import {
  Controller,
  Post,
  Request,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { Account } from '@prisma/client';
import { SignatureService } from './signature.service';
import { AccessTokenGuard } from '../auth/accessToken.guard';
import { CreateSignatureDto } from './dto/create-signature.dto';

@Controller('signature')
export class SignatureController {
  constructor(private signatureService: SignatureService) {}

  @UseGuards(AccessTokenGuard)
  @Post('create')
  create(@Request() req, @Body() createSignatureDto: CreateSignatureDto) {
    const auth: Account = req.user;
    return this.signatureService.create(auth.address, createSignatureDto);
  }
}
