import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserType } from './decorators/user-type.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('signin')
  signin(@Body() signinDto: SigninDto) {
    return this.authService.signin(signinDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@UserType() userId: string) {
    return this.authService.getProfile(userId);
  }

  // @Get('users')
  // @UseGuards(JwtAuthGuard)
  // getUsers() {
  //   return this.userService.getUsers();
  // }

  // @Get('users/:id')
  // @UseGuards(JwtAuthGuard)
  // findOneUser(@Param('id') userId: string) {
  //   return this.userService.findOneUser(userId);
  // }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  updateUser(@UserType() userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@UserType() userId: string, @Req() request: Request) {
    const token = request.headers.authorization?.split(' ')[1] || '';
    return this.authService.logout(userId, token);
  }

  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto.email);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @UserType() userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      userId,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }
}
