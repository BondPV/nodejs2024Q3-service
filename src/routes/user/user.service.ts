import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CustomServiceError } from '../../utils/customServiceError';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  private toSafeUser(user: User) {
    const safeUser = { ...user };
    delete safeUser.password;

    return safeUser;
  }

  async create({ login, password }: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        login,
        password,
      },
    });

    return this.toSafeUser(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map(this.toSafeUser);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new CustomServiceError('User not found', HttpStatus.NOT_FOUND);
    }

    return this.toSafeUser(user);
  }

  async update(
    id: string,
    { oldPassword, newPassword }: UpdatePasswordDto,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new CustomServiceError('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.password !== oldPassword) {
      throw new CustomServiceError(
        'Password is incorrect',
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: newPassword,
        updatedAt: new Date(),
        version: user.version + 1,
      },
    });

    return this.toSafeUser(updatedUser);
  }

  async remove(id: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new CustomServiceError('User not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User removed successfully' };
  }
}
