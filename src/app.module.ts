import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SchoolModule } from './school/school.module';
import { StudentModule } from './student/student.module';
import { BillingModule } from './billing/billing.module';
import { JwtModule } from '@nestjs/jwt';
import { TrialClassModule } from './trial-class/trial-class.module';
import { JournalModule } from './journal/journal.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'school-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        'mongodb+srv://username:password@cluster.mongodb.net/school?retryWrites=true&w=majority&appName=Cluster',
    ),
    AuthModule,
    SchoolModule,
    StudentModule,
    BillingModule,
    TrialClassModule,
    JournalModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
