import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { CustomServiceError } from '../../utils/customServiceError';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async create({
    name,
    duration,
    artistId,
    albumId,
  }: CreateTrackDto): Promise<Track> {
    const track = await this.prisma.track.create({
      data: {
        name,
        duration,
        artistId: artistId ?? null,
        albumId: albumId ?? null,
      },
    });

    return track;
  }

  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new CustomServiceError('Track not found', HttpStatus.NOT_FOUND);
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new CustomServiceError('Track not found', HttpStatus.NOT_FOUND);
    }

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: updateTrackDto,
    });

    return updatedTrack;
  }

  async remove(id: string): Promise<{ message: string }> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new CustomServiceError('Track not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.track.delete({
      where: { id },
    });

    return { message: 'Track removed successfully' };
  }
}
