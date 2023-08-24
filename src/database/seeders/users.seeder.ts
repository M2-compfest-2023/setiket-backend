import { PrismaClient, UserType, Prisma } from '@prisma/client';
import userData from './data/users.json';
import { hashPassword } from '../../common/helpers/hash.helper';

const prisma = new PrismaClient();

export default async function usersSeeder() {
  for (const idx in userData) {
    const user = userData[idx];
    const userUpsert: Prisma.UsersCreateInput = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      password: await hashPassword(user.password),
      user_type:
        user.user_type == 'ADMIN'
          ? UserType.ADMIN
          : user.user_type == 'CUSTOMER'
          ? UserType.CUSTOMER
          : UserType.EVENTORGANIZER,
    };

    if ((user.user_type as UserType) == 'ADMIN' && user.adminid)
      userUpsert.administrators = { connectOrCreate: { where: { id: user.adminid }, create: {} } };
    if ((user.user_type as UserType) == 'CUSTOMER' && user.custid)
      userUpsert.customers = { connectOrCreate: { where: { id: user.custid }, create: {} } };
    if ((user.user_type as UserType) == 'EVENTORGANIZER' && user.organization_name && user.eoid)
      userUpsert.eventOrganizers = {
        connectOrCreate: {
          where: {
            id: user.eoid,
          },
          create: {
            organization_name: user.organization_name,
          },
        },
      };

    await prisma.users.upsert({
      where: {
        id: userUpsert.id,
      },
      update: userUpsert,
      create: userUpsert,
    });
  }
  console.log('Users seeded successfully');
}
