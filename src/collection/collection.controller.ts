import {
  Controller,
  Post,
  Request,
  Body,
  UseGuards,
  Get,
} from '@nestjs/common';
import { CollectionService } from './collection.service';
import { AccessTokenGuard } from '../auth/accessToken.guard';
import { CollectionDto } from './dto/collection.dto';
import { ApiHeader, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('collection')
export class CollectionController {
  constructor(private collectionService: CollectionService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(@Request() req, @Body() collectionDto: CollectionDto) {
    return this.collectionService.create(collectionDto);
  }

  @Get()
  findAll() {
    return this.collectionService.findAll();
  }
}
