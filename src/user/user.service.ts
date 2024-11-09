import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { randomUUID } from 'crypto';
import { BusinessError } from '../utils/businessError';
import { getDB } from '../db';

@Injectable()
export class UserService {
  private readonly users: User[] = getDB().users;

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

    const safeUser = Object.assign({}, user);
    delete safeUser.password;
    return safeUser;
  }

  findAll() {
    return this.users;
  }

  findOne(id: string) {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new BusinessError('User not found', 404);

    const safeUser = Object.assign({}, user);
    delete safeUser.password;
    return safeUser;
  }

  update(id: string, { oldPassword, newPassword }: UpdatePasswordDto) {
    const user = this.users.find((user) => user.id === id);
    if (!user) throw new BusinessError('User not found', 404);
    if (user.password !== oldPassword)
      throw new BusinessError('Password is incorrect', 403);
    user.password = newPassword;
    user.updatedAt = Date.now();
    user.version++;

    const safeUser = Object.assign({}, user);
    delete safeUser.password;
    return safeUser;
  }

  remove(id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) throw new BusinessError('User not found', 404);
    return this.users.splice(index, 1);
  }
}
