import { ApiProperty } from '@nestjs/swagger';

export class ListingDto {
  @ApiProperty()
  collectionAddress: string;

  @ApiProperty()
  tokenId: number;

  @ApiProperty()
  price: string;

  @ApiProperty()
  ownerAddress: string;

  @ApiProperty()
  txSignature: string;

  @ApiProperty()
  ownerSignature: string;
}
