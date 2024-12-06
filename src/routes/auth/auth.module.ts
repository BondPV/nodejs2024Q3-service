import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JWT_CONSTANTS } from './auth.constants';
import { PrismaService } from 'src/db/prisma.service';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { CustomServiceErrorFilter } from 'src/utils/customServiceError.filter';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: JWT_CONSTANTS.SECRET,
      signOptions: { expiresIn: JWT_CONSTANTS.TOKEN_EXPIRATION },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: CustomServiceErrorFilter,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
