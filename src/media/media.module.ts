import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User, UserSchema } from '../auth/schemas/user.schema';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { Media, MediaSchema } from './schemas/media.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Media.name, schema: MediaSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MediaController],
  providers: [MediaService, JwtAuthGuard],
  exports: [MediaService],
})
export class MediaModule {}
