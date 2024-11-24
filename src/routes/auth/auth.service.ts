import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/db/prisma.service';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { compare } from 'bcrypt';
import { CustomServiceError } from 'src/utils/customServiceError';
import { JWT_CONSTANTS } from './auth.constants';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<TokenDto> {
    const user = await this.prisma.user.findUnique({
      where: { login: dto.login },
    });

    if (!user) {
      throw new CustomServiceError('User does not exist', HttpStatus.FORBIDDEN);
    }

    const matchPassword = await compare(dto.password, user.password);

    if (!matchPassword)
      throw new CustomServiceError(
        'Password is incorrect',
        HttpStatus.FORBIDDEN,
      );

    return {
      accessToken: await this.jwtService.signAsync({
        userId: user.id,
        login: dto.login,
      }),
      refreshToken: await this.jwtService.signAsync(
        {
          userId: user.id,
          login: dto.login,
        },
        {
          secret: JWT_CONSTANTS.REFRESH_SECRET,
          expiresIn: JWT_CONSTANTS.REFRESH_TOKEN_EXPIRATION,
        },
      ),
    };
  }

  async refresh({ refreshToken }: RefreshDto): Promise<TokenDto> {
    if (!refreshToken) {
      throw new CustomServiceError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: JWT_CONSTANTS.REFRESH_SECRET,
      });

      return {
        accessToken: await this.jwtService.signAsync({
          userId: decoded.userId,
          login: decoded.login,
        }),
        refreshToken: await this.jwtService.signAsync(
          {
            userId: decoded.userId,
            login: decoded.login,
          },
          {
            secret: JWT_CONSTANTS.REFRESH_SECRET,
            expiresIn: JWT_CONSTANTS.REFRESH_TOKEN_EXPIRATION,
          },
        ),
      };
    } catch {
      throw new CustomServiceError(
        'Token is invalid or expired',
        HttpStatus.FORBIDDEN,
      );
    }
  }
}
