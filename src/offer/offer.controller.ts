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
import { OfferDto } from './dto/offer.dto';
import { Public } from '../app.decorator';

@Controller('offer')
export class OfferController {
  constructor(private offerService: OfferService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Request() req, @Body() offerDto: OfferDto) {
    const auth: Auth = req.user;
    return this.offerService.create(auth, offerDto);
  }

  @Post('accept')
  @UseGuards(AccessTokenGuard)
  accept(@Request() req, @Body() offerDto: OfferDto) {
    const auth: Auth = req.user;
    return this.offerService.accept(auth.address, offerDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.offerService.findAll();
  }

  @Get(':collection/:tokenId')
  @Public()
  findOffers(
    @Param('collection') collection: string,
    @Param('tokenId') tokenId: string,
  ) {
    return this.offerService.findOffers(collection, +tokenId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.offerService.findOne(+id);
  }
}
