import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/providers/prisma';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

    async getAllCategories() {
        return await this.prisma.category.findMany();
    }

    async getEventByCategory(id: number) {
        const events = await this.prisma.event.findMany({
            where: {
                category_id: +id,
            },
        });

        return events;
    }
}
