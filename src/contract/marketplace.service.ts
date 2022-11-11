import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import {
  EthersContract,
  InjectContractProvider,
  Contract,
} from 'nestjs-ethers';
import ABI from './abis/KittyKartMarketplace.json';

@Injectable()
export class MarketplaceService {
  private readonly logger = new Logger(MarketplaceService.name);
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
    this.logger.log(`getNonce address: ${address}`);
    return await this.contract.nonces(address);
  }

  async isSignatureVerified(signature: string): Promise<boolean> {
    this.logger.log(`isSingatureVerified`);
    try {
      return await this.contract.signatures(signature);
    } catch (error) {
      this.logger.log(`invalid signature`);
      throw new BadRequestException('Invalid tx signature');
    }
  }

  async list(contractAddress: string, tokenId: number, price: number) {
    this.logger.log(
      `list contractAddress: ${contractAddress}, tokenId: ${tokenId}, price: ${price}`,
    );
    return await this.contract.list(contractAddress, tokenId, price);
  }

  async buy(contractAddress: string, tokenId: number, amount: number) {
    this.logger.log(
      `buy contractAddress: ${contractAddress}, tokenId: ${tokenId}, amount: ${amount}`,
    );
    return await this.contract.buy(contractAddress, tokenId, amount);
  }

  async makeOffer(contractAddress: string, tokenId: number, amount: number) {
    this.logger.log(
      `buy contractAddress: ${contractAddress}, tokenId: ${tokenId}, amount: ${amount}`,
    );
    return await this.contract.makeOffer(contractAddress, tokenId, amount);
  }

  async acceptOffer(contractAddress: string, tokenId: number) {
    this.logger.log(
      `buy contractAddress: ${contractAddress}, tokenId: ${tokenId}`,
    );
    return await this.contract.acceptOffer(contractAddress, tokenId);
  }
}
