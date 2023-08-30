import { ApiProperty } from '@nestjs/swagger';

export class OfferDto {
  @ApiProperty()
  collectionAddress: string;

  @ApiProperty()
  tokenId: number;

  @ApiProperty()
  price: string;

  @ApiProperty()
  txSignature: string;

  @ApiProperty()
  ownerSignature: string;
}
