import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Db } from 'mongodb';
import { LoginDto } from 'src/dtos/login.dto';
import { RegisterDto } from 'src/dtos/register.dto';
import { MONGO_DB } from 'src/providers/mongo.provider';
import { PayloadSchema } from 'src/schema/payload.schema';
import { UserSchema } from 'src/schema/user.schema';
import { compare, hash } from 'src/utils/bcrypt.util';
import { USER_COLLECTION } from 'src/utils/constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(MONGO_DB) private db: Db,
  ) {}

  async register(dto: RegisterDto) {
    const user = this.db.collection<UserSchema>(USER_COLLECTION);
    const existingUser = await user.findOne({ email: dto.email });
    if (existingUser) throw new ConflictException('Email already in use');
    const hashed = await hash(dto.password);
    const newUser = {
      ...dto,
      password: hashed,
      createdAt: new Date(),
      isDeleted: false,
      permissions: [],
      role: dto.role || 'Patient',
    };
    const result = await user.insertOne(newUser);
    const inserted = await user.findOne({ _id: result.insertedId });
    delete inserted?.password;
    return inserted;
  }

  async validateUser(email: string, password: string) {
    const user = this.db.collection<UserSchema>(USER_COLLECTION);
    const existingUser = await user.findOne({ email, isDeleted: false });
    if (!existingUser) return null;
    const ok = await compare(password, existingUser.password as string);
    if (!ok) return null;
    delete existingUser.password;
    return existingUser;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload: PayloadSchema = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
    };
    return { access_token: this.jwtService.sign(payload), user };
  }
}
