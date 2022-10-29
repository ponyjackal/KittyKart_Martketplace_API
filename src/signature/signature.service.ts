import { Injectable } from '@nestjs/common';
import { InjectSignerProvider, EthersSigner, Wallet } from 'nestjs-ethers';
import { PrismaService } from '../prisma/prisma.service';
import { MarketplaceService } from '../contract/marketplace.service';
import { CreateSignatureDto } from './dto/create-signature.dto';
import { MarketplaceSignatureDto } from './dto/marketplace-signature.dto';
import {
  MARKETPLACE_SIGN_DOMAIN,
  MARKETPLACE_SIGN_VERSION,
  MARKETPLACE_SIGN_TYPES,
} from '../utils/constants';

@Injectable()
export class SignatureService {
  constructor(
    @InjectSignerProvider()
    private readonly ethersSigner: EthersSigner,
    private prisma: PrismaService,
    private marketplaceService: MarketplaceService,
  ) {}

  async create(address: string, createSignatureDto: CreateSignatureDto) {
    const nonce = await this.marketplaceService.getNonce(address);
    const expiry = Math.floor((new Date().getTime() + 60 * 60 * 1000) / 1000);

    const signData: MarketplaceSignatureDto = {
      ...createSignatureDto,
      user: address,
      nonce,
      expiry,
    };

    const typedDomain = {
      name: MARKETPLACE_SIGN_DOMAIN,
      version: MARKETPLACE_SIGN_VERSION,
      chainId: process.env.CHAIN_ID,
      verifyingContract: createSignatureDto.collection,
    };

    const gameServerWallet: Wallet = this.ethersSigner.createWallet(
      process.env.GAME_SERVER_PRIVATE_KEY,
    );
    const signature = await gameServerWallet._signTypedData(
      typedDomain,
      MARKETPLACE_SIGN_TYPES,
      signData,
    );

    // save signature
    await this.prisma.account.update({
      where: { address },
      data: {
        signature,
      },
    });

    return { signature };
  }
}
