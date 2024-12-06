import {
  Controller,
  UseFilters,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Body,
  HttpCode,
} from '@nestjs/common';
import { CustomServiceErrorFilter } from 'src/utils/customServiceError.filter';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Public()
@Controller('auth')
@UseFilters(CustomServiceErrorFilter)
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/signup')
  create(@Body() loginDto: LoginDto) {
    return this.userService.create(loginDto);
  }

  @Post('/login')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/refresh')
  @HttpCode(200)
  refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto);
  }
}
