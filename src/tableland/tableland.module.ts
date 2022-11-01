import { Module } from '@nestjs/common';
import { InjectSignerProvider, EthersSigner, Wallet } from 'nestjs-ethers';
import { HttpModule } from '@nestjs/axios';
import { connect, NetworkName, ChainName } from '@tableland/sdk';
import { TablelandService } from './tableland.service';

@Module({
  imports: [HttpModule],
  providers: [
    TablelandService,
    {
      provide: 'TABLELAND_CONNECTION',
      useFactory: async (ethersSigner: EthersSigner) => {
        const gameServerWallet: Wallet = ethersSigner.createWallet(
          process.env.GAME_SERVER_WALLET_PRIVATE,
        );

        const tbl = await connect({
          signer: gameServerWallet,
          network: 'testnet',
          chain: 'ethereum-goerli',
        });

        return tbl;
      },
      inject: [EthersSigner],
    },
  ],
  exports: [TablelandService],
})
export class TablelandModule {}
