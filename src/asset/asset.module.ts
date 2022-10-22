import { Module } from '@nestjs/common';
import { EthersModule } from 'nestjs-ethers';
import { AssetService } from './asset.service';

@Module({
  imports: [
    EthersModule.forRoot({
      network: process.env.NETWORK,
      infura: {
        projectId: process.env.INFURA_PROJECT_ID,
        projectSecret: process.env.INFURA_PROJECT_SECRET,
      },
      useDefaultProvider: true,
    })
  ],
  providers: [AssetService],
  exports: [AssetService]
})
export class AssetModule {}
