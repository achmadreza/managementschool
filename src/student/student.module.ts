import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Student, StudentSchema } from './schemas/student.schema';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User, UserSchema } from '../auth/schemas/user.schema';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'school-secret-key',
    }),
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [StudentService, JwtAuthGuard],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentModule {}
