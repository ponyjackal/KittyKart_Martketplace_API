import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CollectionDto } from './dto/collection.dto';

@Injectable()
export class CollectionService {
  constructor(private prisma: PrismaService) {}

  async create(collectionDto: CollectionDto) {
    const collection = await this.prisma.collection.create({
      data: {
        address: collectionDto.address,
        name: collectionDto.name,
        symbol: collectionDto.symbol,
      },
    });

    return collection;
  }

  findAll() {
    return this.prisma.collection.findMany({});
  }
}
