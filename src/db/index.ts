import { User } from '../user/entities/user.entity';
import { Track } from '../track/entities/track.entity';
import { Artist } from '../artist/entities/artist.entity';

interface IDB {
  users: User[];
  tracks: Track[];
  artists: Artist[];
}

const db: IDB = {
  users: [],
  tracks: [],
  artists: [],
};

export const getDB = () => db;
