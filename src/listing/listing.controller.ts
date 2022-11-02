import {
  Controller,
  Post,
  Request,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Account } from '@prisma/client';
import { ListingService } from './listing.service';
import { AccessTokenGuard } from '../auth/accessToken.guard';
import { ListingDto } from './dto/listing.dto';
@Controller('listing')
export class ListingController {
  constructor(private listingService: ListingService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Request() req, @Body() listingDto: ListingDto) {
    const auth: Account = req.user;
    return this.listingService.create(auth.address, listingDto);
  }

  @Get()
  findAll() {
    return this.listingService.findAll();
  }
}
