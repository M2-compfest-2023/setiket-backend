import { PrismaService } from '@/providers/prisma';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getAllCategories(): Promise<any> {
    return await this.prisma.category.findMany();
  }

  async getEventByCategory(id: number): Promise<any> {
    const events = await this.prisma.event.findMany({
      where: {
        category_id: +id,
      },
    });

    return events;
  }
}
