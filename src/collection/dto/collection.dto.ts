import { ApiProperty } from '@nestjs/swagger';

export class CollectionDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;
}
