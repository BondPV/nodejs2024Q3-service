import { HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entities/album.entity';
import { CustomServiceError } from '../../utils/customServiceError';
import { getDB } from '../../db';

@Injectable()
export class AlbumService {
  private readonly albums: Album[] = getDB().albums;

  create({ name, year, artistId }: CreateAlbumDto) {
    const album: Album = {
      id: randomUUID(),
      name,
      year,
      artistId: artistId ?? null,
    };

    this.albums.push(album);

    return this.toSafeAlbum(album);
  }

  findAll() {
    return this.albums.map(this.toSafeAlbum);
  }

  findOne(id: string) {
    const album = this.findAlbumById(id);

    if (!album) {
      throw new CustomServiceError('Album not found', HttpStatus.NOT_FOUND);
    }

    return this.toSafeAlbum(album);
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = this.findAlbumById(id);

    if (!album) {
      throw new CustomServiceError('Album not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(album, updateAlbumDto);

    return this.toSafeAlbum(album);
  }

  remove(id: string) {
    const index = this.albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new CustomServiceError('Album not found', HttpStatus.NOT_FOUND);
    }

    this.clearRelatedTracks(id);
    this.removeFromFavorites(id);

    this.albums.splice(index, 1);

    return { message: 'Album removed successfully' };
  }

  private findAlbumById(id: string): Album | undefined {
    return this.albums.find((album) => album.id === id);
  }

  private clearRelatedTracks(albumId: string): void {
    getDB().tracks.forEach((track) => {
      if (track.albumId === albumId) {
        track.albumId = null;
      }
    });
  }

  private removeFromFavorites(albumId: string): void {
    const favorites = getDB().favorites.albums;
    const index = favorites.indexOf(albumId);

    if (index !== -1) {
      favorites.splice(index, 1);
    }
  }

  private toSafeAlbum(album: Album) {
    const { ...safeAlbum } = album;
    return safeAlbum;
  }
}
