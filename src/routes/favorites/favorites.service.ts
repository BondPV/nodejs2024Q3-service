import { Injectable } from '@nestjs/common';
import { Favorites } from './entities/favorites.entity';
import { getDB } from '../../db';
import { CustomServiceError } from '../../utils/customServiceError';

@Injectable()
export class FavoritesService {
  private readonly favorites: Favorites = getDB().favorites;

  findAll() {
    const artists = this.favorites.artists.map((id) =>
      getDB().artists.find((artist) => artist.id === id),
    );
    const albums = this.favorites.albums.map((id) =>
      getDB().albums.find((albums) => albums.id === id),
    );
    const tracks = this.favorites.tracks.map((id) =>
      getDB().tracks.find((track) => track.id === id),
    );

    return {
      artists,
      albums,
      tracks,
    };
  }

  addTrack(id: string) {
    const track = getDB().tracks.find((track) => track.id === id);

    if (!track) {
      throw new CustomServiceError('Track not found', 422);
    }

    this.favorites.tracks.push(id);
  }

  addArtist(id: string) {
    const artist = getDB().artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new CustomServiceError('Artist not found', 422);
    }

    this.favorites.artists.push(id);
  }

  addAlbum(id: string) {
    const album = getDB().albums.find((album) => album.id === id);

    if (!album) {
      throw new CustomServiceError('Album not found', 422);
    }

    this.favorites.albums.push(id);
  }

  deleteTrack(id: string) {
    const index = this.favorites.tracks.indexOf(id);

    if (index === -1) {
      throw new CustomServiceError('Track is not favorites', 404);
    }

    this.favorites.tracks.splice(index, 1);
  }

  deleteArtist(id: string) {
    const index = this.favorites.artists.indexOf(id);

    if (index === -1) {
      throw new CustomServiceError('Artist is not favorites', 404);
    }

    this.favorites.artists.splice(index, 1);
  }

  deleteAlbum(id: string) {
    const index = this.favorites.albums.indexOf(id);

    if (index === -1) {
      throw new CustomServiceError('Album is not favorites', 404);
    }

    this.favorites.albums.splice(index, 1);
  }
}
