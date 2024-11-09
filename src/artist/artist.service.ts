import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { randomUUID } from 'crypto';
import { BusinessError } from '../utils/businessError';
import { getDB } from '../db';

@Injectable()
export class ArtistService {
  private readonly artists: Artist[] = getDB().artists;

  create({ name, grammy }: CreateArtistDto) {
    const artist = {
      id: randomUUID(),
      name,
      grammy,
    };
    this.artists.push(artist);
    return artist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) throw new BusinessError('Artist not found', 404);
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) throw new BusinessError('Artist not found', 404);
    return Object.assign(artist, updateArtistDto);
  }

  remove(id: string) {
    const index = this.artists.findIndex((artist) => artist.id === id);
    if (index === -1) throw new BusinessError('Artist not found', 404);
    getDB().tracks.forEach((track) => {
      if (track.artistId === id) track.artistId = null;
    });
    return this.artists.splice(index, 1);
  }
}
