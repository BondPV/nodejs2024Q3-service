import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CustomServiceError } from '../../utils/customServiceError';
import { getDB } from '../../db';

@Injectable()
export class UserService {
  private readonly users: User[] = getDB().users;

  private toSafeUser(user: User) {
    const safeUser = { ...user };
    delete safeUser.password;

    return safeUser;
  }

  create({ login, password }: CreateUserDto) {
    const user: User = {
      id: randomUUID(),
      login,
      password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(user);

    return this.toSafeUser(user);
  }

  findAll() {
    return this.users.map(this.toSafeUser);
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new CustomServiceError('User not found', 404);
    }

    return this.toSafeUser(user);
  }

  update(id: string, { oldPassword, newPassword }: UpdatePasswordDto) {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new CustomServiceError('User not found', 404);
    }

    if (user.password !== oldPassword) {
      throw new CustomServiceError('Password is incorrect', 403);
    }

    user.password = newPassword;
    user.updatedAt = Date.now();
    user.version++;

    return this.toSafeUser(user);
  }

  remove(id: string) {
    const index = this.users.findIndex((user) => user.id === id);

    if (index === -1) {
      throw new CustomServiceError('User not found', 404);
    }

    this.users.splice(index, 1);

    return { message: 'User removed successfully' };
  }
}
