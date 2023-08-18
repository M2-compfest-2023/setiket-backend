import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/providers/prisma';
import { Users } from './users.model';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<Users[]> {
    return await this.prisma.users.findMany();
  }
}
