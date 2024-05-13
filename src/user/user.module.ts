import { Module } from '@nestjs/common';
import { V1UserController } from './v1/user.controller';
import { UserService } from './v1/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [V1UserController],
  providers: [UserService],
})
export class UserModule {}
