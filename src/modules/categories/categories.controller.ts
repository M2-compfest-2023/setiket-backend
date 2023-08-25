import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResponseMessage } from '@/common/decorators/responseMessage.decorator';

import { CategoriesService } from './categories.service';

@Controller('category')
@ApiTags('Categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    @Get()
    @ResponseMessage('Categories retrieved successfully')
    async getAllCategories() {
        const categories = await this.categoriesService.getAllCategories();
        return categories;
    }

    @Get(':id')
    @ResponseMessage('Events retrieved successfully')
    async getEventByCategory(@Param('id') id: number) {
        const events = await this.categoriesService.getEventByCategory(+id);
        return events;
    }
}
