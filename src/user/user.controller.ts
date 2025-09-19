import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { SearchSchema } from 'src/schema/search.schema';
import { Filter } from 'mongodb';
import { UserSchema } from 'src/schema/user.schema';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/allDecorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private usersService: UserService) {}
  
  @Post('search')
  async userList(@Body() body: Partial<SearchSchema>) {
    const query: Filter<UserSchema> = {};
    if (body.keyword) {
      query.$or = [
        { name: { $regex: body.keyword, $options: 'i' } },
        { email: { $regex: body.keyword, $options: 'i' } },
      ];
    }
    const users = await this.usersService.userList(
      query,
      body.page,
      body.limit,
    );
    return users;
  }

  @UseGuards(RoleGuard)
  @Roles('Admin')
  @Post()
  async createUser(@Body() reqBody: Omit<UserSchema, '_createdAt' | 'isDeleted' | '_id'>) {
    return await this.usersService.create(reqBody);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @UseGuards(RoleGuard)
  @Roles('Admin')
  @Delete(':id')
  async deleteSingleUser(@Param('id') id: string) {
    return await this.usersService.deleteById(id);
  }

  @UseGuards(RoleGuard)
  @Roles('Admin')
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() data: Partial<UserSchema>) {
    return await this.usersService.updateUser(id, data);
  }
}
