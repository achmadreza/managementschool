import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Student, StudentSchema } from '../student/schemas/student.schema';
import { TrialClass, TrialClassSchema } from './schemas/trial-class.schema';
import { TrialClassController } from './trial-class.controller';
import { TrialClassService } from './trial-class.service';
import { User, UserSchema } from 'src/auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrialClass.name, schema: TrialClassSchema },
      { name: Student.name, schema: StudentSchema },
      { name: User.name, schema: UserSchema }, // Add the User schema here
    ]),
  ],
  controllers: [TrialClassController],
  providers: [TrialClassService, JwtAuthGuard],
  exports: [TrialClassService],
})
export class TrialClassModule {}
