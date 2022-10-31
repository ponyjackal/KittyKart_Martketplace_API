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
import { ListingService } from './listing.service';
import { AccessTokenGuard } from '../auth/accessToken.guard';
import { ListingDto } from './dto/listing.dto';
import { Public } from '../app.decorator';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';

@Controller('listing')
export class ListingController {
  constructor(private listingService: ListingService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Request() req, @Body() listingDto: ListingDto) {
    const auth: Auth = req.user;
    return this.listingService.create(auth.address, listingDto);
  }

  @Post('accept')
  @UseGuards(AccessTokenGuard)
  accept(@Request() req, @Body() listingDto: ListingDto) {
    const auth: Auth = req.user;
    return this.listingService.accept(auth.address, listingDto);
  }

  @Get(':collection/:tokenId')
  @Public()
  findAll(
    @Param('collection') collection: string,
    @Param('tokenId') tokenId: string,
  ) {
    return this.listingService.findAll(collection, +tokenId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.listingService.findOne(+id);
  }
}
