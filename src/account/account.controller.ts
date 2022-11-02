import {
  Controller,
  Get,
  Post,
  Request,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Account } from '@prisma/client';
import { AccountService } from './account.service';
import { UpdateAccountDto } from './dto/update-account.dto';
import { AccessTokenGuard } from '../auth/accessToken.guard';
import { Public } from '../app.decorator';

@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

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

  @Patch()
  @UseGuards(AccessTokenGuard)
  update(@Request() req, @Body() updateAccountDto: UpdateAccountDto) {
    const auth: Account = req.user;
    return this.accountService.update(auth.address, updateAccountDto);
  }

  @Delete()
  @UseGuards(AccessTokenGuard)
  remove(@Request() req) {
    const auth: Account = req.user;
    return this.accountService.remove(auth.address);
  }
}
