import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { CustomServiceErrorFilter } from '../../utils/customServiceError.filter';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieve all users.' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieve a user by ID.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password updated successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Password is incorrect.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.update(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User removed successfully.',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
