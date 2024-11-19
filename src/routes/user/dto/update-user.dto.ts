import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'The current password of the user',
    type: String,
  })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'The new password for the user',
    type: String,
  })
  @IsString()
  newPassword: string;
}
