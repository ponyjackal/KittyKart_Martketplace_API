import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { utils } from 'ethers';
import { Account } from '@prisma/client';
import { ethers } from 'ethers';
import * as argon2 from 'argon2';
import { hashMessage } from 'ethers/lib/utils';
import { PrismaService } from '../prisma/prisma.service';
import { checksumAddress } from 'src/utils/checkSumAddress';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private prisma: PrismaService) {}

  async findOne(address: string): Promise<Account> {
    if (!utils.isAddress(address)) {
      throw new BadRequestException('Not a valid address');
    }

    return this.prisma.account.upsert({
      where: {
        address: checksumAddress(address),
      },
      update: {},
      create: {
        address: checksumAddress(address),
        username: Math.random().toString(36).substr(2, 5),
        nonce: Math.floor(Math.random() * 1000000),
      },
    });
  }

  updateNonce(address: string) {
    return this.prisma.account.update({
      where: { address: checksumAddress(address) },
      data: { nonce: Math.floor(Math.random() * 1000000) },
    });
  }

  async validateAuth(
    address: string,
    signature: string,
  ): Promise<Account | null> {
    const auth: Account = await this.findOne(address);

    const signer = ethers.utils.recoverAddress(
      hashMessage(`Login to KittyKart Marketplace nonce: ${auth.nonce}`),
      signature,
    );

    if (signer.toLowerCase() === address.toLocaleLowerCase()) {
      return auth;
    }

    return null;
  }

  async getTokens(auth: Account) {
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
    await this.prisma.account.update({
      where: {
        address: checksumAddress(address),
      },
      data: {
        refreshToken: hashedRefreshToken,
      },
    });
  }

  async login(auth: Account) {
    const tokens = await this.getTokens(auth);
    await this.updateRefreshToken(auth.address, tokens.refreshToken);
    return tokens;
  }

  async logout(address: string) {
    await this.prisma.account.update({
      where: {
        address: checksumAddress(address),
      },
      data: {
        refreshToken: null,
      },
    });
  }

  async refreshTokens(address: string, refreshToken: string) {
    const auth: Account = await this.findOne(address);
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
    const auth: Account = await this.findOne(userWallet.address);
    const sigString = `Login to KittyKart Marketplace nonce: ${auth.nonce}`;
    const signature = await userWallet.signMessage(sigString);
    return signature;
  }
}
