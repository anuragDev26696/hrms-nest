import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { mongoProvider } from 'src/providers/mongo.provider';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, ...mongoProvider],
  exports: [UserService],
})
export class UserModule {}
