import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService
  ) {}

  create(createAccountDto: CreateAccountDto) {
    return this.prisma.account.create({ data: {
      address: createAccountDto.address.toLowerCase(), // store address in lowercase
      username: Math.random().toString(36).substr(2, 5),
      nonce: Math.floor(Math.random() * 1000000)
    } });
  }

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

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return this.prisma.account.update({ where: { id }, data: updateAccountDto });
  }

  remove(id: number) {
    return this.prisma.account.delete({ where: { id } });
  }
}
