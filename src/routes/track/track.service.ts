import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { CustomServiceError } from '../../utils/customServiceError';
import { getDB } from '../../db';

@Injectable()
export class TrackService {
  private readonly tracks: Track[] = getDB().tracks;

  private findTrackById(id: string): Track | undefined {
    return this.tracks.find((track) => track.id === id);
  }

  private removeFromFavorites(trackId: string): void {
    const favorites = getDB().favorites.tracks;
    const favIndex = favorites.indexOf(trackId);

    if (favIndex !== -1) {
      favorites.splice(favIndex, 1);
    }
  }

  create({ name, duration, artistId, albumId }: CreateTrackDto) {
    const track: Track = {
      id: randomUUID(),
      name,
      duration,
      artistId: artistId ?? null,
      albumId: albumId ?? null,
    };

    this.tracks.push(track);

    return track;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    const track = this.findTrackById(id);

    if (!track) {
      throw new CustomServiceError('Track not found', 404);
    }

    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.findTrackById(id);

    if (!track) {
      throw new CustomServiceError('Track not found', 404);
    }

    Object.assign(track, updateTrackDto);

    return track;
  }

  remove(id: string) {
    const index = this.tracks.findIndex((track) => track.id === id);

    if (index === -1) {
      throw new CustomServiceError('Track not found', 404);
    }

    this.removeFromFavorites(id);
    this.tracks.splice(index, 1);

    return { message: 'Track removed successfully' };
  }
}
