import { HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CustomServiceError } from '../../utils/customServiceError';
import { generateHash } from '../../utils/generateHash';
import { PrismaService } from '../../db/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });

    if (existingUser) {
      throw new CustomServiceError(
        'User with this login already exists',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await generateHash(dto.password);
    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    return plainToClass(User, newUser);
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => plainToClass(User, user));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new CustomServiceError('User not found', HttpStatus.NOT_FOUND);
    }

    return plainToClass(User, user);
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

    const hashedNewPassword = await generateHash(newPassword);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { version: { increment: 1 }, password: hashedNewPassword },
    });

    return plainToClass(User, updatedUser);
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
