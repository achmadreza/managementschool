import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { Billing, BillingSchema } from './schemas/billing.schema';
import { Student, StudentSchema } from 'src/student/schemas/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Billing.name, schema: BillingSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
