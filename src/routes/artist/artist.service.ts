import { HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { CustomServiceError } from '../../utils/customServiceError';
import { getDB } from '../../db';

@Injectable()
export class ArtistService {
  private readonly artists: Artist[] = getDB().artists;

  create({ name, grammy }: CreateArtistDto) {
    const artist: Artist = {
      id: randomUUID(),
      name,
      grammy,
    };
    this.artists.push(artist);

    return this.toSafeArtist(artist);
  }

  findAll() {
    return this.artists.map(this.toSafeArtist);
  }

  findOne(id: string) {
    const artist = this.findArtistById(id);

    if (!artist) {
      throw new CustomServiceError('Artist not found', HttpStatus.NOT_FOUND);
    }

    return this.toSafeArtist(artist);
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = this.findArtistById(id);

    if (!artist) {
      throw new CustomServiceError('Artist not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(artist, updateArtistDto);

    return this.toSafeArtist(artist);
  }

  remove(id: string) {
    const index = this.artists.findIndex((artist) => artist.id === id);

    if (index === -1) {
      throw new CustomServiceError('Artist not found', HttpStatus.NOT_FOUND);
    }

    this.clearRelatedTracksAndAlbums(id);
    this.removeFromFavorites(id);

    this.artists.splice(index, 1);

    return { message: 'Artist removed successfully' };
  }

  private findArtistById(id: string): Artist | undefined {
    return this.artists.find((artist) => artist.id === id);
  }

  private clearRelatedTracksAndAlbums(artistId: string): void {
    getDB().tracks.forEach((track) => {
      if (track.artistId === artistId) {
        track.artistId = null;
      }
    });

    getDB().albums.forEach((album) => {
      if (album.artistId === artistId) {
        album.artistId = null;
      }
    });
  }

  private removeFromFavorites(artistId: string): void {
    const favorites = getDB().favorites.artists;
    const index = favorites.indexOf(artistId);

    if (index !== -1) {
      favorites.splice(index, 1);
    }
  }

  private toSafeArtist(artist: Artist) {
    const { ...safeArtist } = artist;
    return safeArtist;
  }
}
