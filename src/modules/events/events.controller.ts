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
import { HttpCode } from '@nestjs/common';
import { Token } from '@/common/decorators/token.decorator';
import { FilterEventDto } from './dtos/filter-event.dto';

@Controller('events')
@ApiTags('Events')
export class EventController {
  constructor(private readonly eventsService: EventService) {}

  @Get()
  @HttpCode(200)
  @ResponseMessage('Events retrieved successfully')
  async getAllEvents() {
    return await this.eventsService.getAllEvents();
  }

  @Get(':id')
  @HttpCode(200)
  @ResponseMessage('Event retrieved successfully')
  async getEventById(@Param('id') id: number) {
    return await this.eventsService.getEventById(id);
  }

  @Get(':id/sales')
  @HttpCode(200)
  @ResponseMessage('Event sales retrieved successfully')
  async getEventSales(@Param('id') id: number) {
    return await this.eventsService.getEventSales(id);
  }

  @Get('user/me')
  @Roles(UserType.CUSTOMER, UserType.EVENTORGANIZER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ResponseMessage('Events retrieved successfully')
  async getEventByUser(@Token('id') id: string) {
    return await this.eventsService.getEventByUser(id);
  }

  @Post()
  @Roles(UserType.ADMIN, UserType.EVENTORGANIZER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @HttpCode(201)
  @ResponseMessage('Event created successfully')
  async createEvent(
    @Body() eventData: CreateEventDto,
    @Token('id') id: string,
  ) {
    return await this.eventsService.createEvent(eventData, id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(UserType.ADMIN, UserType.EVENTORGANIZER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @HttpCode(200)
  @ResponseMessage('Event updated successfully')
  async updateEvent(
    @Param('id') id: number,
    @Body() eventData: UpdateEventDto,
  ) {
    return await this.eventsService.updateEvent(id, eventData);
  }

  @Delete(':id')
  @Roles(UserType.ADMIN, UserType.EVENTORGANIZER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ResponseMessage('Event deleted successfully')
  async deleteEvent(@Param('id') id: number) {
    return await this.eventsService.deleteEvent(id);
  }

  @Get('eo/:id')
  @HttpCode(200)
  @ResponseMessage('Events retrieved successfully')
  async getEventsByOrganizer(@Param('id') id: number) {
    return await this.eventsService.getEventsByOrganizer(id);
  }

  @Get('filter')
  @HttpCode(200)
  @ResponseMessage('Events retrieved successfully')
  async filterEvents(@Query() filterEvent: FilterEventDto) {
    return await this.eventsService.filterEvents(filterEvent);
  }

  @Put('approval/:id')
  @Roles(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ResponseMessage('Success change approval event')
  async approveEvent(
    @Param('id') id: number,
    @Body() approve: ApproveEventDto,
    // @Param('approve') approve: boolean,
  ) {
    return await this.eventsService.approveEvent(id, approve);
  }
}
