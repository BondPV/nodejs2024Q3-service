import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { randomUUID } from 'crypto';
import { CustomServiceError } from '../../utils/customServiceError';
import { getDB } from '../../db';

@Injectable()
export class AlbumService {
  private readonly albums: Album[] = getDB().albums;

  create({ name, year, artistId }: CreateAlbumDto) {
    const album = {
      id: randomUUID(),
      name,
      year,
      artistId: artistId ?? null,
    };
    this.albums.push(album);
    return album;
  }

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    const album = this.albums.find((album) => album.id === id);
    if (!album) throw new CustomServiceError('Album not found', 404);
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.albums.find((album) => album.id === id);
    if (!album) throw new CustomServiceError('Album not found', 404);
    return Object.assign(album, updateAlbumDto);
  }

  remove(id: string) {
    const index = this.albums.findIndex((album) => album.id === id);
    if (index === -1) throw new CustomServiceError('Album not found', 404);
    getDB().tracks.forEach((track) => {
      if (track.albumId === id) track.albumId = null;
    });

    const favIndex = getDB().favorites.albums.indexOf(id);
    if (favIndex !== -1) getDB().favorites.albums.splice(favIndex, 1);

    return this.albums.splice(index, 1);
  }
}
