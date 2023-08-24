import {
  Controller,
  Post,
  Put,
  Body,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './events.service';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { UserType } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/common/decorators/roles.decorator';
import { ApproveEventDto } from './dtos/approve-event.dto';
import { ResponseMessage } from '@/common/decorators/responseMessage.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { RoleGuard } from '@/common/guards/roles/role.guard';

@Controller('events')
@ApiTags('Events')
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @Get()
  @ResponseMessage('Events retrieved successfully')
  async getAllEvents() {
    return await this.eventsService.getAllEvents();
  }

  @Get(':id')
  @ResponseMessage('Event retrieved successfully')
  async getEventById(@Param('id') id: number) {
    return await this.eventsService.getEventById(id);
  }

  @Post()
  @Roles(UserType.ADMIN, UserType.EVENTORGANIZER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ResponseMessage('Event created successfully')
  async createEvent(@Body() eventData: CreateEventDto) {
    return await this.eventsService.createEvent(eventData);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(UserType.ADMIN, UserType.EVENTORGANIZER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ResponseMessage('Event updated successfully')
  async updateEvent(@Param('id') id: number, @Body() eventData: UpdateEventDto) {
    return await this.eventsService.updateEvent(id, eventData);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.EVENTORGANIZER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ResponseMessage('Event deleted successfully')
  async deleteEvent(@Param('id') id: number) {
    return await this.eventsService.deleteEvent(id);
  }

  @Get('eo/:id')
  @ResponseMessage('Events retrieved successfully')
  async getEventsByOrganizer(
    @Param('id') id: number,
  ) {
    return await this.eventsService.getEventsByOrganizer(id);
  }

  @Get('filter')
  @ResponseMessage('Events retrieved successfully')
  async filterEvents(
    @Query('province') province?: string,
    @Query('city') city?: string,
    @Query('category') category?: string,
    @Query('date') date?: string,
  ) {
    return await this.eventsService.filterEvents(province, city, category, date);
  }

  @Put('approval/:id')
  @Roles(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ResponseMessage('Success change approval event')
  async approveEvent(
    @Param('id') id: number,
    @Body() approve: ApproveEventDto,
    // @Param('approve') approve: boolean,
  ) {
    return await this.eventsService.approveEvent(id, approve);
  }
}
