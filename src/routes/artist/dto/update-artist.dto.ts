import { IsBoolean, IsString, ValidateIf } from 'class-validator';

export class UpdateArtistDto {
  @IsString()
  @ValidateIf((object, value) => value !== undefined)
  name?: string;

  @IsBoolean()
  @ValidateIf((object, value) => value !== undefined)
  grammy?: boolean;
}
