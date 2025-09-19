export interface UserSchema {
  _id?: any;
  name: string;
  email: string;
  password?: string;
  role: string;
  permissions?: string[];
  createdAt?: Date;
  isDeleted?: boolean;
}
