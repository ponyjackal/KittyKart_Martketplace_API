import { Injectable, BadRequestException } from '@nestjs/common';
import { LISTING_STATUS } from '@prisma/client';
import { verifyMessage } from 'nestjs-ethers';
import { PrismaService } from '../prisma/prisma.service';
import { MarketplaceService } from '../contract/marketplace.service';
import { ListingDto } from './dto/listing.dto';
import { checksumAddress } from '../utils/checkSumAddress';

@Injectable()
export class ListingService {
  constructor(
    private prisma: PrismaService,
    private marketplaceService: MarketplaceService,
  ) {}

  async create(address: string, listingDto: ListingDto) {
    // validate typed signature
    const isSignatureVerified =
      await this.marketplaceService.isSignatureVerified(listingDto.txSignature);
    if (!isSignatureVerified) {
      throw new BadRequestException('Invalid tx signature');
    }

    // create listing
    const listing = await this.prisma.listing.create({
      data: {
        collection_address: listingDto.collectionAddress,
        token_id: listingDto.tokenId,
        price: listingDto.price,
        seller_address: listingDto.ownerAddress,
        status: LISTING_STATUS.ACTIVE,
      },
    });

    return listing;
  }

  findAll() {
    return this.prisma.listing.findMany({});
  }

  findOne(id: number) {
    return this.prisma.listing.findUnique({ where: { id } });
  }
}
