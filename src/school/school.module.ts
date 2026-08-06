import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from './schemas/school.schema';
import { SchoolService } from './school.service';
import { SchoolController } from './school.controller';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User, UserSchema } from '../auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: School.name, schema: SchoolSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [SchoolService, JwtAuthGuard],
  controllers: [SchoolController],
  exports: [SchoolService],
})
export class SchoolModule {}
