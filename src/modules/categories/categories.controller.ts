import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('category')
@ApiTags('Categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async getAllCategories(
    @Req() _: Request,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const categories = await this.categoriesService.getAllCategories();
      return res
        .status(200)
        .json({ message: 'Categories retrieved successfully', categories });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  }

  @Get(':id')
  async getEventByCategory(
    @Param('id') id: number,
    @Req() _: Request,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const events = await this.categoriesService.getEventByCategory(+id);

      return res
        .status(200)
        .json({ message: 'Events retrieved successfully', events });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  }
}
