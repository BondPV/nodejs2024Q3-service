import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { randomUUID } from 'crypto';
import { CustomServiceError } from '../../utils/customServiceError';
import { getDB } from '../../db';

@Injectable()
export class TrackService {
  private readonly tracks: Track[] = getDB().tracks;

  create({ name, duration, artistId, albumId }: CreateTrackDto) {
    const track = {
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
    const track = this.tracks.find((track) => track.id === id);
    if (!track) throw new CustomServiceError('Track not found', 404);
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) throw new CustomServiceError('Track not found', 404);
    return Object.assign(track, updateTrackDto);
  }

  remove(id: string) {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) throw new CustomServiceError('Track not found', 404);

    const favIndex = getDB().favorites.tracks.indexOf(id);
    if (favIndex !== -1) getDB().favorites.tracks.splice(favIndex, 1);

    return this.tracks.splice(index, 1);
  }
}
