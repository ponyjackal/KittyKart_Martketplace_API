import { Injectable, BadRequestException } from '@nestjs/common';
import { OFFER_STATUS } from '@prisma/client';
import { verifyMessage } from 'nestjs-ethers';
import { PrismaService } from '../prisma/prisma.service';
import { MarketplaceService } from '../contract/marketplace.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { checksumAddress } from '../utils/checkSumAddress';

@Injectable()
export class OfferService {
  constructor(
    private prisma: PrismaService,
    private marketplaceService: MarketplaceService,
  ) {}

  async create(address: string, createOfferDto: CreateOfferDto) {
    // validate user address and signature
    const nonce = await this.marketplaceService.getNonce(address);
    const message = process.env.MESSAGE + nonce;
    const derivedAddress = verifyMessage(
      message,
      createOfferDto.ownerSignature,
    );
    if (checksumAddress(derivedAddress) !== checksumAddress(address)) {
      throw new BadRequestException('Invalid user signature');
    }
    // validate typed signature
    const isSignatureVerified =
      await this.marketplaceService.isSignatureVerified(
        createOfferDto.txSignature,
      );
    if (!isSignatureVerified) {
      throw new BadRequestException('Invalid tx signature');
    }
    // create offer
    const offer = await this.prisma.offer.create({
      data: {
        requester: {
          connect: {
            address: checksumAddress(address),
          },
        },
        request_price: createOfferDto.price,
        status: OFFER_STATUS.PENDING,
        collection: {
          connect: {
            id: createOfferDto.collectionId,
          },
        },
        token_id: createOfferDto.tokenId,
      },
    });

    return offer;
  }

  findAll(collection: string, id: number) {
    return this.prisma.offer.findMany({
      where: {
        collection_address: checksumAddress(collection),
        token_id: id,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.offer.findUnique({ where: { id } });
  }
}
