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
    // validate user address and signature
    const nonce = await this.marketplaceService.getNonce(address);
    // const message = process.env.MESSAGE + (nonce - 1);
    // const derivedAddress = verifyMessage(message, listingDto.ownerSignature);

    // console.log('derivedAddress', derivedAddress);
    // if (checksumAddress(derivedAddress) !== checksumAddress(address)) {
    //   throw new BadRequestException('Invalid user signature');
    // }
    // validate typed signature
    // const isSignatureVerified =
    //   await this.marketplaceService.isSignatureVerified(listingDto.txSignature);
    // if (!isSignatureVerified) {
    //   throw new BadRequestException('Invalid tx signature');
    // }

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

  findAll(collection: string, id: number) {
    return this.prisma.listing.findMany({
      where: {
        collection_address: checksumAddress(collection),
        token_id: id,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.listing.findUnique({ where: { id } });
  }
}
