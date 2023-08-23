import { Prisma, UserType } from '@prisma/client';

export class Users implements Prisma.UsersCreateInput {
  name: string;
  password: string;
  username: string;
  email: string;
  user_type: UserType;
}
