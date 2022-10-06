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
    } });
  }

  findAll() {
    return this.prisma.account.findMany();
  }

  findOne(address: string) {
    return this.prisma.account.upsert({
      where: { address },
      update: {},
      create: {
        address: address.toLowerCase(),
        username: Math.random().toString(36).substr(2, 5),
      }
    });
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return this.prisma.account.update({ where: { id }, data: updateAccountDto });
  }

  remove(id: number) {
    return this.prisma.account.delete({ where: { id } });
  }
}
