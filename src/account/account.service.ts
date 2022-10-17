import { Injectable } from '@nestjs/common';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService
  ) {}

  findAll() {
    return this.prisma.account.findMany();
  }

  // find or create an account
  findOne(address: string) {
    return this.prisma.account.upsert({
      where: { address: address.toLowerCase() },
      update: {},
      create: {
        address: address.toLowerCase(),
        username: Math.random().toString(36).substr(2, 5),
        nonce: Math.floor(Math.random() * 1000000)
      }
    });
  }

  updateNonce(address: string) {
    return this.prisma.account.update({
      where: { address: address.toLowerCase() },
      data: { nonce: Math.floor(Math.random() * 1000000) }
    });
  }

  updateSignature(address: string, signature: string) {
    return this.prisma.account.update({
      where: { address: address.toLowerCase() },
      data: { signature }
    });
  }

  update(address: string, updateAccountDto: UpdateAccountDto) {
    return this.prisma.account.update({ where: { address: address.toLowerCase() }, data: updateAccountDto });
  }

  updateRefreshToken(address: string, refreshToken: string) {
    return this.prisma.account.update({ where: { address: address.toLowerCase() }, data: { refreshToken } });
  }

  remove(address: string) {
    return this.prisma.account.delete({ where: { address: address.toLowerCase() } });
  }
}
