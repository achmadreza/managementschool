import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Journal, JournalSchema } from './schemas/journal.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { Student, StudentSchema } from 'src/student/schemas/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Journal.name, schema: JournalSchema },
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [JournalController],
  providers: [JournalService, JwtAuthGuard],
  exports: [JournalService],
})
export class JournalModule {}
