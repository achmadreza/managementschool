import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaService } from './media.service';

@ApiTags('media')
@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a media record' })
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get media records or search by title' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Case-insensitive partial title search',
  })
  findAll(@Query('q') q?: string) {
    return this.mediaService.findAll(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a media record by ID' })
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a media record' })
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(id, updateMediaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a media record' })
  delete(@Param('id') id: string) {
    return this.mediaService.delete(id);
  }
}
