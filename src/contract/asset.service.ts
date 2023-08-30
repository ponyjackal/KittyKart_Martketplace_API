import { Injectable, Logger } from '@nestjs/common';
import {
  EthersContract,
  InjectContractProvider,
  Contract,
} from 'nestjs-ethers';
import ABI from './abis/KittyKartAsset.json';

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);
  private contract: Contract;

  constructor(
    @InjectContractProvider()
    private readonly ethersProvider: EthersContract,
  ) {
    this.contract = this.ethersProvider.create(
      process.env.KITTY_KART_ASSET_ADDRESS,
      ABI,
    );
  }

  async transferFrom(from: string, to: string, tokenId: number) {
    this.logger.log(
      `transferFrom from: ${from}, to: ${to}, tokenId: ${tokenId}`,
    );
    return await this.contract.transferFrom(from, to, tokenId);
  }

  async OwnerOf(tokenId: number): Promise<string> {
    this.logger.log(`OwnerOf tokenId: ${tokenId}`);

    return await this.contract.ownerOf(tokenId);
  }
}
