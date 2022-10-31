import { Controller, Post, Request, Body, UseGuards } from '@nestjs/common';
import { Auth } from '@prisma/client';
import { ListingService } from './listing.service';
import { AccessTokenGuard } from '../auth/accessToken.guard';
import { ListingDto } from './dto/listing.dto';
@Controller('listing')
export class ListingController {
  constructor(private listingService: ListingService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Request() req, @Body() listingDto: ListingDto) {
    const auth: Auth = req.user;
    return this.listingService.create(auth.address, listingDto);
  }
}
