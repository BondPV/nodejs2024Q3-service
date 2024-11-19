import {
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTrackDto {
  @ApiProperty({
    description: 'The name of the track',
    type: String,
    required: false,
  })
  @IsString()
  @ValidateIf((object, value) => value !== undefined)
  name?: string;

  @ApiProperty({
    description: 'The ID of the artist associated with the track',
    type: String,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  artistId?: string | null;

  @ApiProperty({
    description: 'The ID of the album associated with the track',
    type: String,
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  albumId?: string | null;

  @ApiProperty({
    description: 'The duration of the track in seconds',
    type: Number,
    required: false,
  })
  @IsInt()
  @ValidateIf((object, value) => value !== undefined)
  duration?: number;
}
