import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateTrialClassDto } from './dto/create-trial-class.dto';
import {
  UpdateTrialClassDto,
  UpdateTrialClassStatusDto,
} from './dto/update-trial-class.dto';
import { TrialClassStatus } from './schemas/trial-class.schema';
import { TrialClassService } from './trial-class.service';

@ApiTags('trial-classes')
@Controller('trial-classes')
@UseGuards(JwtAuthGuard)
export class TrialClassController {
  constructor(private readonly trialClassService: TrialClassService) {}

  @Post()
  @ApiOperation({ summary: 'Create a trial class registration' })
  create(@Body() createTrialClassDto: CreateTrialClassDto) {
    return this.trialClassService.create(createTrialClassDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get trial class registrations' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search student, parent, phone, or program/class',
  })
  @ApiQuery({ name: 'status', required: false, enum: TrialClassStatus })
  findAll(@Query('q') q?: string, @Query('status') status?: TrialClassStatus) {
    return this.trialClassService.findAll(q, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a trial class registration by ID' })
  findOne(@Param('id') id: string) {
    return this.trialClassService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a trial class registration' })
  update(
    @Param('id') id: string,
    @Body() updateTrialClassDto: UpdateTrialClassDto,
  ) {
    return this.trialClassService.update(id, updateTrialClassDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update a trial class registration status' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateTrialClassStatusDto: UpdateTrialClassStatusDto,
  ) {
    return this.trialClassService.updateStatus(
      id,
      updateTrialClassStatusDto.status,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a trial class registration' })
  delete(@Param('id') id: string) {
    return this.trialClassService.delete(id);
  }
}
