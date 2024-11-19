import { User } from '../routes/user/entities/user.entity';
import { Track } from '../routes/track/entities/track.entity';
import { Artist } from '../routes/artist/entities/artist.entity';
import { Album } from '../routes/album/entities/album.entity';
import { Favorites } from '../routes/favorites/entities/favorites.entity';

interface IDB {
  users: User[];
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  favorites: Favorites;
}

const db: IDB = {
  users: [],
  tracks: [],
  artists: [],
  albums: [],
  favorites: {
    artists: [],
    albums: [],
    tracks: [],
  },
};

export const getDB = () => db;
