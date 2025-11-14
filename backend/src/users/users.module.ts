import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from '../schemas/user.schema';
import { EmailService } from '../common/services/email.service';
import { LoggerModule } from '../common/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    LoggerModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, EmailService],
  exports: [UsersService],
})
export class UsersModule {}

