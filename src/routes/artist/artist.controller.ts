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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { CustomServiceErrorFilter } from '../../utils/customServiceError.filter';

@ApiTags('Artists')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Artist created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieve all artists.' })
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieve an artist by ID.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Artist not found.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.artistService.findOne(id);
  }

  @Put(':id')
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Artist updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Artist not found.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Artist removed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Artist not found.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.artistService.remove(id);
  }
}
