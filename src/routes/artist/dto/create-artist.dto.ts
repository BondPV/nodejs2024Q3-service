import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({
    description: 'The name of the artist',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Indicates if the artist has won a Grammy',
    type: Boolean,
  })
  @IsBoolean()
  grammy: boolean;
}
