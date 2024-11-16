import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomServiceError } from '../../utils/customServiceError';
import { PrismaService } from '../../db/prisma.service';
import { FavoritesResponseDto } from './dto/response-favorites.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<FavoritesResponseDto> {
    const [artists, albums, tracks] = await Promise.all([
      this.prisma.favoriteArtist.findMany({ select: { artist: true } }),
      this.prisma.favoriteAlbum.findMany({ select: { album: true } }),
      this.prisma.favoriteTrack.findMany({ select: { track: true } }),
    ]);

    return {
      artists: artists.map(({ artist }) => artist),
      albums: albums.map(({ album }) => album),
      tracks: tracks.map(({ track }) => track),
    };
  }

  async addTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new CustomServiceError(
        'Track not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favoriteTrack.create({
      data: { trackId: id },
    });
  }

  async addArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new CustomServiceError(
        'Artist not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favoriteArtist.create({ data: { artistId: id } });
  }

  async addAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new CustomServiceError(
        'Album not found',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.prisma.favoriteAlbum.create({ data: { albumId: id } });
  }

  async deleteTrack(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new CustomServiceError(
        'Track is not favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.favoriteTrack.delete({ where: { trackId: id } });
  }

  async deleteArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new CustomServiceError(
        'Artist is not favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.favoriteArtist.delete({ where: { artistId: id } });
  }

  async deleteAlbum(id: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new CustomServiceError(
        'Album is not favorites',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.favoriteAlbum.delete({ where: { albumId: id } });
  }
}
