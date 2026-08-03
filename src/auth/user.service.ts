import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashPassword } from './password.util';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      $or: [{ email: createUserDto.email }, { id: createUserDto.id }],
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new ConflictException('Passwords do not match');
    }

    if (!createUserDto.password) {
      throw new ConflictException('Password is required');
    }

    const password = createUserDto.password;

    const hashedPassword = await hashPassword(password);

    const user = new this.userModel({
      id: createUserDto.id ?? crypto.randomUUID(),
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      password: hashedPassword,
      phone: createUserDto.phone,
      schoolCode: createUserDto.schoolCode,
      googleOAuthID: createUserDto.googleOAuthID,
    });
    if (createUserDto.role) {
      user.role = createUserDto.role;
    }

    return user.save();
  }

  async getUsers(filters?: { id?: string; email?: string; role?: string }) {
    const query: QueryFilter<UserDocument> = {};

    if (filters?.id?.trim()) {
      query.id = filters.id.trim();
    }

    if (filters?.email?.trim()) {
      query.email = {
        $regex: filters.email.trim().toLowerCase(),
        $options: 'i',
      };
    }

    if (filters?.role?.trim()) {
      const normalizedRole = filters.role.trim().toLowerCase();
      const isValidRole = Object.values(UserRole).includes(
        normalizedRole as UserRole,
      );

      if (!isValidRole) {
        return [];
      }

      query.role = normalizedRole as UserRole;
    }

    return this.userModel.find(query).select('-password -__v').lean();
  }

  async findOneUser(identifier: string) {
    const user = await this.userModel
      .findOne({
        $or: [{ id: identifier }, { email: identifier.toLowerCase() }],
      })
      .select('-password -__v')
      .lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userModel.findOne({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being updated and if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.userModel.findOne({
        email: updateUserDto.email,
      });
      if (existingEmail) {
        throw new ConflictException('Email already in use');
      }
    }

    // Check if schoolCode is being updated and if it already exists
    if (
      updateUserDto.schoolCode &&
      updateUserDto.schoolCode !== user.schoolCode
    ) {
      const existingCode = await this.userModel.findOne({
        schoolCode: updateUserDto.schoolCode,
      });
      if (existingCode) {
        throw new ConflictException('School code already in use');
      }
    }

    // Update user fields
    if (updateUserDto.fullName) user.fullName = updateUserDto.fullName;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.phone) user.phone = updateUserDto.phone;
    if (updateUserDto.schoolCode) user.schoolCode = updateUserDto.schoolCode;
    if (updateUserDto.role) user.role = updateUserDto.role;

    return user.save();
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const result = await this.userModel.deleteOne({ id: userId });

    if (result.deletedCount === 0) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully' };
  }
}
