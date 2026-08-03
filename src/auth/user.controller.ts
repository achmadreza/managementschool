import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth('bearer')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiQuery({ name: 'id', required: false, description: 'Filter by user ID' })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Filter by email using LIKE pattern (regex)',
  })
  @ApiQuery({
    name: 'role',
    required: false,
    description: 'Filter by role (admin, teacher, parent)',
  })
  getAllUsers(
    @Query('id') id?: string,
    @Query('email') email?: string,
    @Query('role') role?: string,
  ) {
    return this.userService.getUsers({ id, email, role });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID or email' })
  getUser(@Param('id') identifier: string) {
    return this.userService.findOneUser(identifier);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user by ID' })
  updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete user by ID' })
  deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
