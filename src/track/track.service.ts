import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { randomUUID } from 'crypto';
import { BusinessError } from '../utils/businessError';
import { getDB } from '../db';

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
    if (!track) throw new BusinessError('Track not found', 404);
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) throw new BusinessError('Track not found', 404);
    if (updateTrackDto?.name === null || updateTrackDto?.duration === null)
      throw new BusinessError('Name and duration cannot be null', 400);
    return Object.assign(track, updateTrackDto);
  }

  remove(id: string) {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) throw new BusinessError('Track not found', 404);
    return this.tracks.splice(index, 1);
  }
}
