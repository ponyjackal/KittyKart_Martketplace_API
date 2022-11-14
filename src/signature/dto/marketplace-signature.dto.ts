import { ApiProperty } from '@nestjs/swagger';

export class MarketplaceSignatureDto {
  @ApiProperty()
  user: string;

  @ApiProperty()
  collection: string;

  @ApiProperty()
  tokenId: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  actionType: number;

  @ApiProperty()
  nonce: number;

  @ApiProperty()
  expiry: number;
}
