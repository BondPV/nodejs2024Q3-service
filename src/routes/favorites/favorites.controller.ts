import {
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  UseFilters,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { CustomServiceErrorFilter } from '../../utils/customServiceError.filter';

@ApiTags('Favorites')
@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieve all favorites.',
  })
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('/track/:id')
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Track added to favorites.',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Track not found.',
  })
  addTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addTrack(id);
  }

  @Post('/artist/:id')
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Artist added to favorites.',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Artist not found.',
  })
  addArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addArtist(id);
  }

  @Post('/album/:id')
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Album added to favorites.',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Album not found.',
  })
  addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addAlbum(id);
  }

  @Delete('/track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Track removed from favorites.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Track is not favorites.',
  })
  deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.deleteTrack(id);
  }

  @Delete('/artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Artist removed from favorites.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Artist is not favorites.',
  })
  deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.deleteArtist(id);
  }

  @Delete('/album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Album removed from favorites.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Album is not favorites.',
  })
  deleteAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.deleteAlbum(id);
  }
}
