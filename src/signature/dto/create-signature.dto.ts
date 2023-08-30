import { ApiProperty } from '@nestjs/swagger';

export enum ActionType {
  LIST = 0,
  BUY = 1,
  OFFER = 2,
  ACCEPT_OFFER = 3,
}

export class CreateSignatureDto {
  @ApiProperty()
  collection: string;

  @ApiProperty()
  tokenId: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  actionType: ActionType;
}
