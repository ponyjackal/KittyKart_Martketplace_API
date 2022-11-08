import { ApiProperty } from '@nestjs/swagger';

export class UpdateAccountDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  refreshToken: string;
}
