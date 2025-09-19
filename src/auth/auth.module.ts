import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config';
import { AuthController } from './auth.controller';
import { mongoProvider } from 'src/providers/mongo.provider';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ...mongoProvider],
  exports: [AuthService],
})
export class AuthModule {}
