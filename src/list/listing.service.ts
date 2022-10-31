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
    const message = process.env.MESSAGE + (nonce - 1);
    const derivedAddress = verifyMessage(message, listingDto.ownerSignature);
    if (checksumAddress(derivedAddress) !== checksumAddress(address)) {
      throw new BadRequestException('Invalid user signature');
    }
    // validate typed signature
    const isSignatureVerified =
      await this.marketplaceService.isSignatureVerified(listingDto.txSignature);
    if (!isSignatureVerified) {
      throw new BadRequestException('Invalid tx signature');
    }
    // create listing
    const listing = await this.prisma.listing.create({
      data: {
        price: listingDto.price,
        status: LISTING_STATUS.ACTIVE,
        collection: {
          connect: {
            id: listingDto.collectionId,
          },
        },
        token_id: listingDto.tokenId,
      },
    });

    return listing;
  }

  async accept(address: string, listingDto: ListingDto) {
    // validate user address and signature
    const nonce = await this.marketplaceService.getNonce(address);
    const message = process.env.MESSAGE + (nonce - 1);
    const derivedAddress = verifyMessage(message, listingDto.ownerSignature);
    if (checksumAddress(derivedAddress) !== checksumAddress(address)) {
      throw new BadRequestException('Invalid user signature');
    }
    // validate typed signature
    const isSignatureVerified =
      await this.marketplaceService.isSignatureVerified(listingDto.txSignature);
    if (!isSignatureVerified) {
      throw new BadRequestException('Invalid tx signature');
    }
    // update accepted listing
    const collection = await this.prisma.collection.findUnique({
      where: {
        id: listingDto.collectionId,
      },
    });
    // update rejected listing
    await this.prisma.listing.updateMany({
      where: {
        AND: {
          collection_address: collection.address,
          token_id: listingDto.tokenId,
        },
      },
      data: {
        status: LISTING_STATUS.REJECTED,
        rejected_at: new Date(),
      },
    });
    // update accepted listing
    const listing = await this.prisma.listing.findFirst({
      orderBy: {
        id: 'desc',
      },
    });
    await this.prisma.listing.update({
      where: {
        id: listing.id,
      },
      data: {
        status: LISTING_STATUS.ACCEPTED,
        accepted_at: new Date(),
        rejected_at: null,
      },
    });
    // TODO; need to down the token from the listinging

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
