import { Module } from '@nestjs/common';
import { InjectSignerProvider, EthersSigner, Wallet } from 'nestjs-ethers';
import { connect, NetworkName, ChainName } from '@tableland/sdk';
import { TablelandService } from './tableland.service';

@Module({
  providers: [
    TablelandService,
    {
      provide: 'TABLELAND_CONNECTION',
      useFactory: async (ethersSigner: EthersSigner) => {
        const gameServerWallet: Wallet = ethersSigner.createWallet(
          process.env.GAME_SERVER_PRIVATE_KEY,
        );

        const tbl = await connect({
          signer: gameServerWallet,
          network: 'testnet',
          chain: 'ethereum-goerli',
        });

        return tbl;
      },
    },
  ],
  exports: [TablelandService],
})
export class TablelandModule {}
