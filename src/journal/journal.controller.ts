import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateJournalDto } from './dto/create-journal.dto';
import { UpdateJournalDto } from './dto/update-journal.dto';
import { JournalService } from './journal.service';
import { JournalStatus } from './schemas/journal.schema';

@ApiTags('journals')
@Controller('journals')
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  @ApiOperation({ summary: 'Create a journal entry' })
  create(@Body() createJournalDto: CreateJournalDto) {
    return this.journalService.create(createJournalDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get journal entries' })
  @ApiQuery({ name: 'target', required: false })
  @ApiQuery({ name: 'status', required: false, enum: JournalStatus })
  findAll(
    @Req() req: any,
    @Query('target') target?: string,
    @Query('status') status?: JournalStatus,
  ) {
    return this.journalService.findAll(req, target, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a journal entry by ID' })
  findOne(@Param('id') id: string) {
    return this.journalService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a journal entry' })
  update(@Param('id') id: string, @Body() updateJournalDto: UpdateJournalDto) {
    return this.journalService.update(id, updateJournalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a journal entry' })
  delete(@Param('id') id: string) {
    return this.journalService.delete(id);
  }
}
