import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

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

    const user = new this.userModel({
      id: createUserDto.id ?? crypto.randomUUID(),
      fullName: createUserDto.fullName,
      email: createUserDto.email,
      password: createUserDto.password,
      phone: createUserDto.phone,
      googleOAuthID: createUserDto.googleOAuthID,
    });
    if (createUserDto.role) {
      user.role = createUserDto.role;
    }

    return user.save();
  }

  async getUsers() {
    return this.userModel.find().select('-password -__v').lean();
  }

  async findOneUser(userId: string) {
    const user = await this.userModel
      .findOne({ id: userId })
      .select('-password -__v')
      .lean();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
