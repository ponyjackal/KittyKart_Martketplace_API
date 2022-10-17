import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Public } from '../app.decorator';
import { AccessTokenGuard } from '../auth/accessToken.guard';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':address')
  @Public()
  findOne(@Param('address') address: string) {
    return this.accountService.findOne(address);
  }

  @Patch(':address')
  @UseGuards(AccessTokenGuard)
  update(@Param('address') address: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(address, updateAccountDto);
  }

  @Delete(':address')
  @UseGuards(AccessTokenGuard)
  remove(@Param('address') address: string) {
    return this.accountService.remove(address);
  }
}
