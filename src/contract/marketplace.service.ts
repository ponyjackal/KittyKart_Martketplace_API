import { Injectable } from '@nestjs/common';
import {
  EthersContract,
  InjectContractProvider,
  Contract,
} from 'nestjs-ethers';
import ABI from './abis/KittyKartMarketplace.json';

@Injectable()
export class MarketplaceService {
  private contract: Contract;

  constructor(
    @InjectContractProvider()
    private readonly ethersProvider: EthersContract,
  ) {
    this.contract = this.ethersProvider.create(
      process.env.MARKETPLACE_ADDRESS,
      ABI,
    );
  }

  async getNonce(address: string): Promise<number> {
    return await this.contract.nonce(address);
  }

  async isSignatureVerified(signature: string): Promise<boolean> {
    return await this.contract.signatures(signature);
  }
}
