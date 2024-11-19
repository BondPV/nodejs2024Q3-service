import { IsBoolean, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateArtistDto {
  @ApiProperty({
    description: 'The name of the artist',
    type: String,
    required: false,
  })
  @IsString()
  @ValidateIf((object, value) => value !== undefined)
  name?: string;

  @ApiProperty({
    description: 'Indicates if the artist has won a Grammy',
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @ValidateIf((object, value) => value !== undefined)
  grammy?: boolean;
}
