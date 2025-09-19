import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsString() @IsNotEmpty() @MinLength(2) name: string;
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() role: string;
  @IsArray() permissions: string[];
  @IsBoolean() isDeleted: boolean;
}
