import { Global, Module } from '@nestjs/common';
import { UserHandlers } from './userHandlers.service';
import { User, UserSchema } from 'src/schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ResponseHandlers } from './responseHandler.service';
import { LoggerService } from './loggerHandler.service';

@Global()
@Module({
  providers: [UserHandlers, ResponseHandlers, LoggerService],
  exports: [UserHandlers, ResponseHandlers, LoggerService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class HandlersModule {}
