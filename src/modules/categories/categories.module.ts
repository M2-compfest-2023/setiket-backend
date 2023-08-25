import { Module } from '@nestjs/common';

import { PrismaService } from '@/providers/prisma';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
    imports: [],
    controllers: [CategoriesController],
    providers: [CategoriesService, PrismaService],
})
export class CategoriesModule {}
