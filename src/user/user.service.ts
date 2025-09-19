import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Db, Filter, ObjectId } from 'mongodb';
import { MONGO_DB } from 'src/providers/mongo.provider';
import { UserSchema } from 'src/schema/user.schema';
import { USER_COLLECTION } from 'src/utils/constants';

@Injectable()
export class UserService {
  constructor(@Inject(MONGO_DB) private db: Db) {}
  private get col() {
    return this.db.collection<UserSchema>(USER_COLLECTION);
  }

  async findById(id: string) {
    const user = await this.col.findOne({ _id: new ObjectId(id), isDeleted: false });
    if (!user) throw new NotFoundException('User not found');
    delete user.password;
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.col.findOne({ email: email.toLowerCase(), isDeleted: false });
    if (!user) return null;
    delete user.password;
    return user;
  }

  async create(payload: Omit<UserSchema, 'createdAt' | 'isDeleted' | '_id'>) {
    const res = await this.col.insertOne(payload);
    return this.findById(res.insertedId.toString());
  }

  async deleteById(id: string) {
    const user = await this.col.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { isDeleted: true } }, { returnDocument: 'after' });
    if (!user) throw new NotFoundException('User not found');
    const { password, ...safeUser } = user;
    console.log(password);
    return safeUser;
  }

  async updateUser(id: string, req: Partial<UserSchema>) {
    const user = await this.col.findOneAndUpdate({ _id: new ObjectId(id), isDeleted: false }, {$set: req }, {returnDocument: 'after'});
    if (!user) throw new NotFoundException('User not found');
    delete user.password;
    return user;
  }

  async userList(query?: Filter<UserSchema>, page = 0, limit = 20) {
    const cursor = this.col.find({...query, isDeleted: false}).skip(page * limit).limit(limit);
    const total = await this.col.countDocuments({...query, isDeleted: false});
    const hasNext = total > (page + 1) * limit;
    const hasPrev = page > 0;
    const result = await cursor.toArray();
    const data = result.map((u) => {
      delete u.password;
      return u;
    });
    return { data, total, page, limit, hasNext, hasPrev };
  }
}
