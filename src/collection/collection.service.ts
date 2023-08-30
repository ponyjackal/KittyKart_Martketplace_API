import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CollectionDto } from './dto/collection.dto';

@Injectable()
export class CollectionService {
  private readonly logger = new Logger(CollectionService.name);

  constructor(private prisma: PrismaService) {}

  async create(collectionDto: CollectionDto) {
    this.logger.log(
      `create a new collection: ${JSON.stringify(collectionDto)}`,
    );

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
    this.logger.log(`find all`);

    return this.prisma.collection.findMany({});
  }
}
