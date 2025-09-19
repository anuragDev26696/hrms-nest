import { isEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty() name: string;
  @isEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsString() role?: string;
}
