import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  @ValidateIf((object, value) => value !== undefined)
  name?: string;

  @IsNumber()
  @ValidateIf((object, value) => value !== undefined)
  year?: boolean;

  @IsOptional()
  @IsUUID()
  artistId: string | null;
}
