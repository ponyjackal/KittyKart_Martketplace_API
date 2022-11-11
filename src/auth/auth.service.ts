import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { utils } from 'ethers';
import { Auth } from '@prisma/client';
import { ethers } from 'ethers';
import * as argon2 from 'argon2';
import { hashMessage } from 'ethers/lib/utils';
import { PrismaService } from '../prisma/prisma.service';
import { checksumAddress } from 'src/utils/checkSumAddress';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async findOne(address: string): Promise<Auth> {
    this.logger.log(`findOne address: ${address}`);

    if (!utils.isAddress(address)) {
      this.logger.error(`Invalid address: ${address}`);
      throw new BadRequestException('Not a valid address');
    }

    this.logger.log(`finding an addressin auth table; address: ${address}`);

    return this.prisma.auth.upsert({
      where: {
        address: checksumAddress(address),
      },
      update: {},
      create: {
        username: Math.random().toString(36).substr(2, 5),
        nonce: Math.floor(Math.random() * 1000000),
        account: {
          connectOrCreate: {
            where: {
              address: checksumAddress(address),
            },
            create: {
              address: checksumAddress(address),
            },
          },
        },
      },
    });
  }

  updateNonce(address: string) {
    this.logger.log(`update nonce in auth table; address ${address}`);

    return this.prisma.auth.update({
      where: { address: checksumAddress(address) },
      data: { nonce: Math.floor(Math.random() * 1000000) },
    });
  }

  async validateAuth(address: string, signature: string): Promise<Auth | null> {
    this.logger.log(`validating an address: ${address}`);

    const auth: Auth = await this.findOne(address);

    const signer = ethers.utils.recoverAddress(
      hashMessage(process.env.WALLET_SIGN_MESSAGE),
      signature,
    );

    if (signer.toLowerCase() === address.toLocaleLowerCase()) {
      this.logger.log(`auth is valid; auth: ${JSON.stringify(auth)}`);
      return auth;
    }

    this.logger.log(`auth is invalid; address: ${address}`);

    return null;
  }

  async getTokens(auth: Auth) {
    const payload = { id: auth.id, address: auth.address };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(address: string, refreshToken: string) {
    const hashedRefreshToken: string = await this.hashData(refreshToken);
    await this.prisma.auth.update({
      where: {
        address: checksumAddress(address),
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  async login(auth: Auth) {
    const tokens = await this.getTokens(auth);
    await this.updateRefreshToken(auth.address, tokens.refreshToken);
    return tokens;
  }

  async logout(address: string) {
    await this.prisma.auth.update({
      where: {
        address: checksumAddress(address),
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async refreshTokens(address: string, refreshToken: string) {
    const auth: Auth = await this.findOne(address);
    if (!auth || !auth.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      auth.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(auth);
    await this.updateRefreshToken(auth.address, tokens.refreshToken);
    return tokens;
  }

  async getSignature(privateKey: string) {
    const userWallet = new ethers.Wallet(privateKey);
    const sigString = process.env.WALLET_SIGN_MESSAGE;
    const signature = await userWallet.signMessage(sigString);
    return signature;
  }
}
