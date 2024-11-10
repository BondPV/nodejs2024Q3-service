import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseFilters,
  Put,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CustomServiceErrorFilter } from '../../utils/customServiceError.filter';

@ApiTags('Tracks')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Track created successfully.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createTrackDto: CreateTrackDto) {
    return this.trackService.create(createTrackDto);
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'Retrieve all tracks.' })
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieve a track by ID.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Track not found.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trackService.findOne(id);
  }

  @Put(':id')
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Track updated successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Track not found.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseFilters(CustomServiceErrorFilter)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Track removed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Track not found.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.trackService.remove(id);
  }
}
