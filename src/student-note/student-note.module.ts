import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { Student, StudentSchema } from '../student/schemas/student.schema';
import { StudentNoteController } from './student-note.controller';
import { StudentNoteService } from './student-note.service';
import { StudentNote, StudentNoteSchema } from './schemas/student-note.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StudentNote.name, schema: StudentNoteSchema },
      { name: Student.name, schema: StudentSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [StudentNoteService, JwtAuthGuard],
  controllers: [StudentNoteController],
  exports: [StudentNoteService],
})
export class StudentNoteModule {}
