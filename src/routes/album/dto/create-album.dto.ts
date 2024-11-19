import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlbumDto {
  @ApiProperty({
    description: 'The name of the album',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The release year of the album',
    type: Number,
  })
  @IsNumber()
  year: number;

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
