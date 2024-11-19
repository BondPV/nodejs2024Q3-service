import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlbumDto {
  @ApiProperty({
    description: 'The name of the album',
    type: String,
    required: false,
  })
  @IsString()
  @ValidateIf((object, value) => value !== undefined)
  name?: string;

  @ApiProperty({
    description: 'The release year of the album',
    type: Number,
    required: false,
  })
  @IsNumber()
  @ValidateIf((object, value) => value !== undefined)
  year?: number;

  @ApiProperty({
    description: 'The ID of the artist associated with the album',
    type: String,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  artistId: string | null;
}
