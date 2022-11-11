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
}
