import { Module } from '@nestjs/common';
import { EthersSigner, Wallet } from 'nestjs-ethers';
import { connect } from '@tableland/sdk';
import { TablelandService } from './tableland.service';

@Module({
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
