import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { CustomServiceError } from '../../utils/customServiceError';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAlbumDto): Promise<Album> {
    const newAlbum = await this.prisma.album.create({ data: dto });

    return newAlbum;
  }

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new CustomServiceError('Album not found', HttpStatus.NOT_FOUND);
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new CustomServiceError('Album not found', HttpStatus.NOT_FOUND);
    }

    const updatedAlbum = await this.prisma.album.update({
      where: { id },
      data: updateAlbumDto,
    });

    return updatedAlbum;
  }

  async remove(id: string): Promise<{ message: string }> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new CustomServiceError('Album not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.album.delete({
      where: { id },
    });

    return { message: 'Album removed successfully' };
  }
}
