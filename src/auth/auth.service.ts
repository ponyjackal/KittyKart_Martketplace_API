import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from '@prisma/client';
import { AccountService } from '../account/account.service';
import { ethers } from 'ethers';
import { hashMessage } from 'ethers/lib/utils';

@Injectable()
export class AuthService {
    constructor(
        private accountService: AccountService,
        private jwtService: JwtService,
    ) {}
    
    async validateAccount(address: string, signature: string): Promise<Account | null> {
        const account: Account =  await this.accountService.findOne(address);

        const signer = ethers.utils.recoverAddress(hashMessage(`Login to KittyKart Marketplace nonce: ${account.nonce}`), signature);

        if(signer.toLowerCase() === address.toLocaleLowerCase()) {

            return account;
        }
        
        return null;
    }
    
    async login(account: Account) {
        const payload = { id: account.id, address: account.address };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                payload,
                {
                    secret: process.env.JWT_ACCESS_SECRET,
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                payload,
                {
                    secret: process.env.JWT_REFRESH_SECRET,
                    expiresIn: '7d',
                },
            ),
          ]);
      
          return {
            accessToken,
            refreshToken,
          };
    }
}
