import {
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  UseFilters,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CustomServiceErrorFilter } from '../../utils/customServiceError.filter';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post('/track/:id')
  @UseFilters(CustomServiceErrorFilter)
  addTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addTrack(id);
  }

  @Post('/artist/:id')
  @UseFilters(CustomServiceErrorFilter)
  addArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addArtist(id);
  }

  @Post('/album/:id')
  @UseFilters(CustomServiceErrorFilter)
  addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.addAlbum(id);
  }

  @Delete('/track/:id')
  @HttpCode(204)
  @UseFilters(CustomServiceErrorFilter)
  deleteTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.deleteTrack(id);
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  @UseFilters(CustomServiceErrorFilter)
  deleteArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.deleteArtist(id);
  }

  @Delete('/album/:id')
  @HttpCode(204)
  @UseFilters(CustomServiceErrorFilter)
  deleteAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoritesService.deleteAlbum(id);
  }
}
