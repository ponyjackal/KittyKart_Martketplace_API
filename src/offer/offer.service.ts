import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { Auth, OFFER_STATUS } from '@prisma/client';
import { verifyMessage } from 'nestjs-ethers';
import { PrismaService } from '../prisma/prisma.service';
import { MarketplaceService } from '../contract/marketplace.service';
import { OfferDto } from './dto/offer.dto';
import { checksumAddress } from '../utils/checkSumAddress';

@Injectable()
export class OfferService {
  private readonly logger = new Logger(OfferService.name);

  constructor(
    private prisma: PrismaService,
    private marketplaceService: MarketplaceService,
  ) {}

  async create(authUser: Auth, offerDto: OfferDto) {
    this.logger.log(
      `create a new offer; address: ${
        authUser.address
      }, offer: ${JSON.stringify(offerDto)}`,
    );
    // validate user address and signature
    this.logger.log('validating a user signature');
    const message = process.env.WALLET_SIGN_MESSAGE;
    const derivedAddress = verifyMessage(message, offerDto.ownerSignature);
    if (checksumAddress(derivedAddress) !== checksumAddress(authUser.address)) {
      this.logger.log('user signature is invalid');
      throw new BadRequestException('Invalid user signature');
    }
    // validate typed signature
    this.logger.log('validating a tx signature');
    const isSignatureVerified =
      await this.marketplaceService.isSignatureVerified(offerDto.txSignature);
    if (!isSignatureVerified) {
      this.logger.log('invalid tx signature');
      throw new BadRequestException('Invalid tx signature');
    }
    // create offer
    this.logger.log('creating an offer into db; offer');
    const offer = await this.prisma.offer.create({
      data: {
        requester: {
          connect: {
            address: checksumAddress(authUser.address),
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
    this.logger.log(
      `accept an offer; address: ${address}, offerDto: ${offerDto}`,
    );
    // validate user address and signature\
    this.logger.log('validating a user signature');
    const message = process.env.WALLET_SIGN_MESSAGE;
    const derivedAddress = verifyMessage(message, offerDto.ownerSignature);
    if (checksumAddress(derivedAddress) !== checksumAddress(address)) {
      this.logger.log('user signature is invalid');
      throw new BadRequestException('Invalid user signature');
    }
    // validate typed signature
    this.logger.log('validating a tx signature');
    const isSignatureVerified =
      await this.marketplaceService.isSignatureVerified(offerDto.txSignature);
    if (!isSignatureVerified) {
      this.logger.log('invalid tx signature');
      throw new BadRequestException('Invalid tx signature');
    }
    // update accepted offer
    this.logger.log(`updating offer in db`);
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

  findOffers(collection: string, id: number) {
    this.logger.log(`finding offers; collection: ${collection}, id: ${id}`);
    return this.prisma.offer.findMany({
      where: {
        collection_address: checksumAddress(collection),
        token_id: id,
      },
    });
  }

  findAll() {
    this.logger.log('find all');
    return this.prisma.offer.findMany({});
  }

  findOne(id: number) {
    this.logger.log(`find one; id: ${id}`);
    return this.prisma.offer.findUnique({ where: { id } });
  }
}
