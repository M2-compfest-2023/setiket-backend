import { PrismaClient, UserType } from "@prisma/client";
import userData from "./data/users.json"
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function usersSeeder () {
  for(let idx in userData) {
    const user = userData[idx]
    const userUpsert = {
      name : user.name,
      username : user.username,
      email : user.email,
      password : await bcrypt.hash(user.password, 10),
      user_type : user.user_type == "ADMIN" ? UserType.ADMIN : user.user_type == "CUSTOMER" ? UserType.CUSTOMER : UserType.EVENTORGANIZER
    }

    await prisma.users.upsert({
      where : {
        id : user.id
      },
      update : userUpsert,
      create : userUpsert
    })
  }
}
