import { Injectable } from '@nestjs/common';
import {
  EthersContract,
  InjectContractProvider,
  Contract,
} from 'nestjs-ethers';
import ABI from './abis/KittyKartGoKart.json';

@Injectable()
export class KartService {
  private contract: Contract;

  constructor(
    @InjectContractProvider()
    private readonly ethersProvider: EthersContract,
  ) {
    this.contract = this.ethersProvider.create(
      process.env.KITTY_KART_GO_KART_ADDRESS,
      ABI,
    );
  }

  async transferFrom(from: string, to: string, tokenId: number) {
    return await this.contract.transferFrom(from, to, tokenId);
  }

  async OwnerOf(tokenId: number): Promise<string> {
    return await this.contract.ownerOf(tokenId);
  }
}
