import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from '@prisma/client';
import { ethers } from 'ethers';
import * as argon2 from 'argon2';
import { AccountService } from '../account/account.service';
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
    
    async getTokens(account: Account) {
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
    
    hashData(data: string) {
        return argon2.hash(data);
    }

    async updateRefreshToken(address: string, refreshToken: string) {
        const hashedRefreshToken: string = await this.hashData(refreshToken);
        await this.accountService.updateRefreshToken(address, hashedRefreshToken);
    }

    async login(account: Account) {
        const tokens = await this.getTokens(account);
        await this.updateRefreshToken(account.address, tokens.refreshToken);
        return tokens;
    }

    async logout(account: Account) {
        await this.accountService.updateRefreshToken(account.address, null);
    }

    async refreshTokens(address: string, refreshToken: string) {
        const account: Account = await this.accountService.findOne(address);
        if (!account || !account.refreshToken)
          throw new ForbiddenException('Access Denied');
        const refreshTokenMatches = await argon2.verify(
            account.refreshToken,
            refreshToken,
        );
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(account);
        await this.updateRefreshToken(account.address, tokens.refreshToken);
        return tokens;
    }
}
