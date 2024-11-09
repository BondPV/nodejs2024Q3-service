import { User } from '../user/entities/user.entity';
import { Track } from '../track/entities/track.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';

interface IDB {
  users: User[];
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
}

const db: IDB = {
  users: [],
  tracks: [],
  artists: [],
  albums: [],
};

export const getDB = () => db;
