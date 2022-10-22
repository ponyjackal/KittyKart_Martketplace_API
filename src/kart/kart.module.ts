import { Module } from '@nestjs/common';
import { EthersModule } from 'nestjs-ethers';
import { KartService } from './kart.service';

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
  providers: [KartService],
  exports: [KartService]
})
export class KartModule {}
