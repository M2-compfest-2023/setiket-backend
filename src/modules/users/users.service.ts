import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/providers/prisma'

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async getAllUsers() {
    return await this.prismaService.users.findMany()
  }

}
