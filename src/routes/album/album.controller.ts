import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseFilters,
  HttpCode,
  ParseUUIDPipe,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { CustomServiceErrorFilter } from '../../utils/customServiceError.filter';

@ApiTags('Albums')
@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Album created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieve all albums.' })
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieve an album by ID.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Album not found.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.albumService.findOne(id);
  }

  @Put(':id')
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Album updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Album not found.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Album removed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Album not found.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.albumService.remove(id);
  }
}
