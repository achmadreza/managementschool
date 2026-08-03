import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SigninDto } from './dto/signin.dto';
import { SigninResponseDto } from './dto/signin-response.dto';
import { hashPassword, verifyPassword } from './password.util';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async signin(signinDto: SigninDto): Promise<SigninResponseDto> {
    const { email, password } = signinDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      code: user.schoolCode,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        schoolCode: user.schoolCode || '',
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel
      .findOne({ id: userId })
      .select('-password -__v')
      .lean();

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async logout(userId: string, token: string) {
    // Add token to user's blacklist to destroy it server-side
    await this.userModel.updateOne(
      { id: userId },
      { $push: { tokenBlacklist: token } },
    );

    return {
      message: 'Logout successful - token destroyed',
      statusCode: 200,
    };
  }

  async forgetPassword(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      // Don't reveal if email exists or not for security
      return {
        message: ' IF email exists, reset link has been sent',
        statusCode: 200,
      };
    }

    // Generate reset token
    const resetToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Set expiry to 1 hour from now
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await this.userModel.updateOne(
      { email },
      {
        resetToken,
        resetTokenExpiry,
      },
    );

    // In production, send email with reset link
    console.log(`Reset token: ${resetToken}`);

    return {
      message: 'If email exists, reset link has been sent',
      data: { token: resetToken },
      statusCode: 200,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userModel.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset token');
    }

    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear reset token
    await this.userModel.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    );

    return {
      message: 'Password reset successful',
      statusCode: 200,
    };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findOne({ id: userId });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isCurrentPasswordValid = await verifyPassword(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedNewPassword = await hashPassword(newPassword);

    // Update to new password
    await this.userModel.updateOne(
      { id: userId },
      { password: hashedNewPassword },
    );

    return {
      message: 'Password changed successfully',
      statusCode: 200,
    };
  }
}
