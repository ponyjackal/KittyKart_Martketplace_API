import {
  Controller,
  Post,
  Request,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Auth } from '@prisma/client';
import { ListingService } from './listing.service';
import { AccessTokenGuard } from '../auth/accessToken.guard';
import { ListingDto } from './dto/listing.dto';
import { ApiHeader, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('listing')
export class ListingController {
  constructor(private listingService: ListingService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer access_token',
  })
  create(@Request() req, @Body() listingDto: ListingDto) {
    const auth: Auth = req.user;
    return this.listingService.create(auth.address, listingDto);
  }

  @Get()
  findAll() {
    return this.listingService.findAll();
  }
}
