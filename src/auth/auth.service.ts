import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SigninDto } from './dto/signin.dto';
import { SigninResponseDto } from './dto/signin-response.dto';
import { hashPassword, verifyPassword } from './password.util';
import { EventEmitter2 } from 'node_modules/@nestjs/event-emitter/dist/eventemitter2';
import { SendEmailPayload } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly eventEmitter: EventEmitter2,
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

    if (user.emailVerified === false) {
      throw new UnauthorizedException(
        'Silahkan cek email anda untuk melakukan verifikasi email',
      );
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
  async verifyEmail(token: string) {
    if (!token) {
      return `
     <!DOCTYPE html>
<html>
  <head>
    <!-- <link rel="stylesheet" href="styles.css" /> -->
    <style type="text/css" media="all">
    body {font-family: sans; background-color: #FDFBF7;}
    .container {
      width:100%;
      min-height: 100dvh;
      display:flex;
      flex-direction:column;
      justify-content: center;
      align-items: center;
      gap:8px;
    }
    .submit {
        background-color: blue; 
        color: white; 
        padding:4px 8px; 
        border-radius:5px;
        border-color:blue;
    }
     span{
      color:red;
      font-weight:bold
    }
      
    </style>
  </head>
  <body>
    <div class="container">
      <div>
      <h3>Permintaan gagal karena <span>tidak ada token</span></h3>
      </div>
    </div>
      <!-- <h1 class="title">Hello World!</h1> -->
      <!-- <script src="script.js"></script> -->
  </body>
</html>`;
    }
    const decode = atob(token);
    const data = JSON.parse(decode);
    const expiredIn = new Date(data.expiredIn);
    if (expiredIn < new Date()) {
      return `
     <!DOCTYPE html>
<html>
  <head>
    <!-- <link rel="stylesheet" href="styles.css" /> -->
    <style type="text/css" media="all">
    body {font-family: sans background-color: #FDFBF7;}
    .container {
      width:100%;
      min-height: 100dvh;
      display:flex;
      flex-direction:column;
      justify-content: center;
      align-items: center;
      gap:8px;
    }
    .submit {
        background-color: blue; 
        color: white; 
        padding:4px 8px; 
        border-radius:5px;
        border-color:blue;
    }
    p span{
      color:#720e9e;
      font-weight:bold
    }
      
    </style>
  </head>
  <body>
    <div class="container">
      <div>
      <p>Maaf token email verify anda sudah <span>kadaluarsa</span>, silahkan klik tombol di bawah untuk melakukan resend email verify</p>
      <a href="${process.env.BASE_URL}/auth/resend-email-verify?token=${btoa(data.email)}" target="_blank">
      <button class="submit">resend email</button>
      </a>
      </div>
    </div>
      <!-- <h1 class="title">Hello World!</h1> -->
      <!-- <script src="script.js"></script> -->
  </body>
</html>`;
    }

    await this.userModel.updateOne(
      { email: data.email },
      { emailVerified: true },
    );

    return `
    <!DOCTYPE html>
<html>
  <head>
    <!-- <link rel="stylesheet" href="styles.css" /> -->
    <style type="text/css" media="all">
    body {font-family: sans background-color: #FDFBF7;}
    .container {
      width:100%;
      min-height: 100dvh;
      display:flex;
      flex-direction:column;
      justify-content: center;
      align-items: center;
      gap:8px;
    }
    .submit {
        background-color: blue; 
        color: white; 
        padding:4px 8px; 
        border-radius:5px;
        border-color:blue;
    }
    p span{
      color:#00FF00;
      font-weight:bold
    }
      
    </style>
  </head>
  <body>
    <div class="container">
      <div>
      <p>selamat email anda telah <span>terverifikasi</span>, silahkan klik tombol di bawah untuk sign in</p>
      <a href="${process.env.FRONTEND_URL}" target="_blank">
      <button class="submit">Sign In</button>
      </
      </div>
    </div>
      <!-- <h1 class="title">Hello World!</h1> -->
      <!-- <script src="script.js"></script> -->
  </body>
</html>
    `;
  }

  async resendEmail(token: string) {
    if (!token) {
      throw new UnauthorizedException('Token is required');
    }
    const email = atob(token);
    const user = await this.userModel.findOne({ email });

    if (user?.emailVerified) {
      throw new UnauthorizedException('Email already verified');
    }
    console.log(email)
    await this.eventEmitter.emitAsync('send.email.verify', {
      subject: 'Email verify',
      to: email,
      data: email,
    } as SendEmailPayload);
    return {
      message: 'Resend email verify success, silahkan cek email anda',
      statusCode: 200,
    };
  }
}
