import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { LISTING_STATUS } from '@prisma/client';
import { verifyMessage } from 'nestjs-ethers';
import { PrismaService } from '../prisma/prisma.service';
import { MarketplaceService } from '../contract/marketplace.service';
import { ListingDto } from './dto/listing.dto';
import { checksumAddress } from '../utils/checkSumAddress';

@Injectable()
export class ListingService {
  private readonly logger = new Logger(ListingService.name);

  constructor(
    private prisma: PrismaService,
    private marketplaceService: MarketplaceService,
  ) {}

  async create(address: string, listingDto: ListingDto) {
    this.logger.log(
      `creating a new list; address: ${address} list: ${JSON.stringify(
        listingDto,
      )}`,
    );
    this.logger.log(`validating signature`);
    // validate typed signature
    const isSignatureVerified =
      await this.marketplaceService.isSignatureVerified(listingDto.txSignature);

    if (!isSignatureVerified) {
      this.logger.error(`invalid signature`);
      throw new BadRequestException('Invalid tx signature');
    }

    const data = {
      collection_address: listingDto.collectionAddress,
      token_id: listingDto.tokenId,
      price: listingDto.price,
      seller_address: listingDto.ownerAddress,
      status: LISTING_STATUS.ACTIVE,
    };
    this.logger.log(
      `creating a new list into db; list: ${JSON.stringify(data)}`,
    );
    // create listing
    const listing = await this.prisma.listing.create({
      data,
    });

    return listing;
  }

  findAll() {
    this.logger.log('find all');
    return this.prisma.listing.findMany({});
  }

  findOne(id: number) {
    this.logger.log('find one');
    return this.prisma.listing.findUnique({ where: { id } });
  }
}
