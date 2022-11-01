import { Injectable, BadRequestException } from '@nestjs/common';
import { OFFER_STATUS } from '@prisma/client';
import { verifyMessage } from 'nestjs-ethers';
import { PrismaService } from '../prisma/prisma.service';
import { MarketplaceService } from '../contract/marketplace.service';
import { OfferDto } from './dto/offer.dto';
import { checksumAddress } from '../utils/checkSumAddress';

@Injectable()
export class OfferService {
  constructor(
    private prisma: PrismaService,
    private marketplaceService: MarketplaceService,
  ) {}

  async create(address: string, offerDto: OfferDto) {
    // validate user address and signature
    const nonce = await this.marketplaceService.getNonce(address);
    const message = process.env.MESSAGE + (nonce - 1);
    const derivedAddress = verifyMessage(message, offerDto.ownerSignature);
    if (checksumAddress(derivedAddress) !== checksumAddress(address)) {
      throw new BadRequestException('Invalid user signature');
    }
    // validate typed signature
    const isSignatureVerified =
      await this.marketplaceService.isSignatureVerified(offerDto.txSignature);
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
        request_price: offerDto.price,
        status: OFFER_STATUS.PENDING,
        collection: {
          connect: {
            address: offerDto.collectionAddress,
          },
        },
        token_id: offerDto.tokenId,
      },
    });

    return offer;
  }

  async accept(address: string, offerDto: OfferDto) {
    // validate user address and signature
    const nonce = await this.marketplaceService.getNonce(address);
    const message = process.env.MESSAGE + (nonce - 1);
    const derivedAddress = verifyMessage(message, offerDto.ownerSignature);
    if (checksumAddress(derivedAddress) !== checksumAddress(address)) {
      throw new BadRequestException('Invalid user signature');
    }
    // validate typed signature
    const isSignatureVerified =
      await this.marketplaceService.isSignatureVerified(offerDto.txSignature);
    if (!isSignatureVerified) {
      throw new BadRequestException('Invalid tx signature');
    }
    // update accepted offer
    const collection = await this.prisma.collection.findUnique({
      where: {
        address: offerDto.collectionAddress,
      },
    });
    // update rejected offer
    await this.prisma.offer.updateMany({
      where: {
        AND: {
          collection_address: collection.address,
          token_id: offerDto.tokenId,
        },
      },
      data: {
        status: OFFER_STATUS.REJECTED,
        rejected_at: new Date(),
      },
    });
    // update accepted offer
    const offer = await this.prisma.offer.findFirst({
      orderBy: {
        id: 'desc',
      },
    });
    await this.prisma.offer.update({
      where: {
        id: offer.id,
      },
      data: {
        status: OFFER_STATUS.ACCEPTED,
        accepted_at: new Date(),
        rejected_at: null,
      },
    });
    // TODO; need to down the token from the listing

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
