import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { mongoProvider } from './providers/mongo.provider';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: jwtConfig.expiresIn },
    }),
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [...mongoProvider],
})
export class AppModule {}
