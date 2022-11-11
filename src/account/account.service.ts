import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { utils } from 'ethers';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TablelandService } from '../tableland/tableland.service';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private prisma: PrismaService,
    private tableland: TablelandService,
  ) {}

  findAll() {
    return this.prisma.account.findMany();
  }

  // find or create an account
  async findOne(address: string) {
    this.logger.log(`findOne with address: ${address}`);
    if (!utils.isAddress(address)) {
      this.logger.error(`invalid address: ${address}`);
      throw new BadRequestException('Not a valid address');
    }

    this.logger.log(`started fetching karts and assets from tableland`);

    const karts = await this.tableland.getKartsByAddress(address);
    const assets = await this.tableland.getAssetsByAddress(address);

    this.logger.log(
      `finished fetching karts and assets from tableland karts: ${JSON.stringify(
        karts,
      )} assets: ${JSON.stringify(assets)}`,
    );

    this.logger.log(`updating account table`);

    const user = await this.prisma.account.upsert({
      where: { address: address.toLowerCase() },
      update: {},
      create: {
        address: address.toLowerCase(),
      },
    });

    const result = {
      ...user,
      tokens: {
        karts: Array.isArray(karts) ? karts : [karts],
        assets: Array.isArray(assets) ? assets : [assets],
      },
    };
    this.logger.log(`return result: ${JSON.stringify(result)}`);

    return result;
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
