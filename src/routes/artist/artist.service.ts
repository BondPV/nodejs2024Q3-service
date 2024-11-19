import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { CustomServiceError } from '../../utils/customServiceError';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateArtistDto) {
    const newArtist = await this.prisma.artist.create({ data: dto });

    return newArtist;
  }

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new CustomServiceError('Artist not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new CustomServiceError('Artist not found', HttpStatus.NOT_FOUND);
    }

    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: updateArtistDto,
    });

    return updatedArtist;
  }

  async remove(id: string): Promise<{ message: string }> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new CustomServiceError('Artist not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.artist.delete({
      where: { id },
    });

    return { message: 'Artist removed successfully' };
  }
}
