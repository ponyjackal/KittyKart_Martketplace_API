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
    return await this.contract.nonces(address);
  }

  async isSignatureVerified(signature: string): Promise<boolean> {
    return await this.contract.signatures(signature);
  }

  async list(contractAddress: string, tokenId: number, price: number) {
    return await this.contract.list(contractAddress, tokenId, price);
  }

  async buy(contractAddress: string, tokenId: number, amount: number) {
    return await this.contract.buy(contractAddress, tokenId, amount);
  }

  async makeOffer(contractAddress: string, tokenId: number, amount: number) {
    return await this.contract.makeOffer(contractAddress, tokenId, amount);
  }

  async acceptOffer(contractAddress: string, tokenId: number) {
    return await this.contract.acceptOffer(contractAddress, tokenId);
  }
}
