import {
  Controller,
  Post,
  Put,
  Body,
  Req,
  Res,
  Delete,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { Request, Response } from 'express';
import { UpdateEventDto } from './dtos/update-event.dto';
import { UserType } from '@prisma/client';
import { RoleGuard } from '@/common/guards/roles/role.guard';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { ApproveEventDto } from './dtos/approve-event.dto';

@Controller('events')
@ApiTags('Events')
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @Get()
  async getAllEvents(@Req() _: Request, @Res() res: Response): Promise<any> {
    try {
      const events = await this.eventsService.getAllEvents();
      return res
        .status(200)
        .json({ message: 'Events retrieved successfully', events });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  }

  @Get(':id')
  async getEventById(
    @Param('id') id: number,
    @Req() _: Request,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const event = await this.eventsService.getEventById(id);
      return res
        .status(200)
        .json({ message: 'Event retrieved successfully', event });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  }

  @Post()
  // @Roles(UserType.ADMIN, UserType.EVENTORGANIZER)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @ApiBearerAuth()
  async createEvent(
    @Body() eventData: CreateEventDto,
    @Req() _: Request,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const event = await this.eventsService.createEvent(eventData);
      return res
        .status(200)
        .json({ message: 'Event created successfully', event });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  }

  @Put(':id')
  // @Roles(UserType.ADMIN, UserType.EVENTORGANIZER)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @ApiBearerAuth()
  async updateEvent(
    @Param('id') id: number,
    @Body() eventData: UpdateEventDto,
    @Req() _: Request,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const event = await this.eventsService.updateEvent(id, eventData);
      return res
        .status(200)
        .json({ message: 'Event updated successfully', event });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.EVENTORGANIZER)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @ApiBearerAuth()
  async deleteEvent(
    @Param('id') id: number,
    @Req() _: Request,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const event = await this.eventsService.deleteEvent(id);
      return res
        .status(200)
        .json({ message: 'Event deleted successfully', event });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  }

  @Get('eo/:id')
  async getEventsByOrganizer(
    @Param('id') id: number,
    @Req() _: Request,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const events = await this.eventsService.getEventsByOrganizer(id);
      return res
        .status(200)
        .json({ message: 'Events retrieved successfully', events });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  }

  @Get('filter')
  async filterEvents(
    @Query('province') province?: string,
    @Query('city') city?: string,
    @Query('category') category?: string,
    @Query('date') date?: string,
    @Req() _?: Request,
    @Res() res?: Response,
  ): Promise<any> {
    try {
      const events = await this.eventsService.filterEvents(
        province,
        city,
        category,
        date,
      );

      return res.json({ message: 'Events retrieved successfully', events });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  }

  @Put('approval/:id')
  // @Roles(UserType.ADMIN)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // @ApiBearerAuth()
  async approveEvent(
    @Param('id') id: number,
    @Body() approve: ApproveEventDto,
    // @Param('approve') approve: boolean,
    @Req() _: Request,
    @Res() res: Response,
  ): Promise<any> {
    try {
      const response = await this.eventsService.approveEvent(id, approve);

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  }
}
