import { Injectable, BadRequestException } from '@nestjs/common';
import { utils } from 'ethers';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TablelandService } from '../tableland/tableland.service';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private tableland: TablelandService,
  ) {}

  findAll() {
    return this.prisma.account.findMany();
  }

  // find or create an account
  async findOne(address: string) {
    if (!utils.isAddress(address)) {
      throw new BadRequestException('Not a valid address');
    }

    const karts = await this.tableland.getKartsByAddress(address);
    const assets = await this.tableland.getAssetsByAddress(address);

    const user = await this.prisma.account.upsert({
      where: { address: address.toLowerCase() },
      update: {},
      create: {
        username: '',
        nonce: 0,
        address: address.toLowerCase(),
      },
    });

    return {
      ...user,
      tokens: {
        karts: Array.isArray(karts) ? karts : [karts],
        assets: Array.isArray(assets) ? assets : [assets],
      },
    };
  }

  updateSignature(address: string, signature: string) {
    return this.prisma.account.update({
      where: { address: address.toLowerCase() },
      data: { signature },
    });
  }

  update(address: string, updateAccountDto: UpdateAccountDto) {
    return this.prisma.account.update({
      where: { address: address.toLowerCase() },
      data: updateAccountDto,
    });
  }

  remove(address: string) {
    return this.prisma.account.delete({
      where: { address: address.toLowerCase() },
    });
  }
}
