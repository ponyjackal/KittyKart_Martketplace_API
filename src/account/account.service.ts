import { Injectable, BadRequestException } from '@nestjs/common';
import { utils } from 'ethers';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '../prisma/prisma.service';

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
    if(!utils.isAddress(address)) {
      throw new BadRequestException('Not a valid address');
    }
    
    return this.prisma.account.upsert({
      where: { address: address.toLowerCase() },
      update: {},
      create: {
        address: address.toLowerCase(),
      }
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

  remove(address: string) {
    return this.prisma.account.delete({ where: { address: address.toLowerCase() } });
  }
}
