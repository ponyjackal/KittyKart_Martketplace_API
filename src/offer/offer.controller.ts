import {
  Controller,
  Post,
  Get,
  Request,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { OfferService } from './offer.service';
import { AccessTokenGuard } from '../auth/accessToken.guard';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Public } from '../app.decorator';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

@Controller('offer')
export class OfferController {
  constructor(private offerService: OfferService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Request() req, @Body() createOfferDto: CreateOfferDto) {
    const auth: Auth = req.user;
    return this.offerService.create(auth.address, createOfferDto);
  }

  @Get(':collection/:tokenId')
  @Public()
  findAll(
    @Param('collection') collection: string,
    @Param('tokenId') tokenId: string,
  ) {
    return this.offerService.findAll(collection, +tokenId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.offerService.findOne(+id);
  }
}
