import { PrismaService } from '@/providers/prisma';
import { Injectable, ParseBoolPipe } from '@nestjs/common';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { Event } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { ApproveEventDto } from './dtos/approve-event.dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllEvents(): Promise<Event[]> {
    const events = await this.prisma.event.findMany();
    return events;
  }

  async getEventById(eventId: number): Promise<Event> {
    const event = await this.prisma.event.findUnique({
      where: { id: +eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    return event;
  }

  async createEvent(eventData: CreateEventDto): Promise<any> {
    const {
      title,
      description,
      start_date,
      end_date,
      location,
      ticket_total,
      category_id,
      organizer_id,
    } = eventData;

    const event = await this.prisma.event.create({
      data: {
        title,
        description,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        location,
        ticket_total,
        category_id,
        organizer_id,
        verified: false,
        city_id : eventData.city_id
      },
    });

    return event;
  }

  async updateEvent(
    eventId: number,
    eventData: UpdateEventDto,
  ): Promise<Event> {
    const existingEvent = await this.prisma.event.findUnique({
      where: { id: +eventId },
    });

    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id: +eventId },
      data: eventData,
    });

    return updatedEvent;
  }

  async deleteEvent(eventId: number): Promise<Event> {
    const existingEvent = await this.prisma.event.findUnique({
      where: { id: +eventId },
    });
    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const deletedEvent = await this.prisma.event.delete({
      where: { id: +eventId },
    });

    return deletedEvent;
  }

  async getEventsByOrganizer(organizerId: number): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { organizer_id: +organizerId },
    });
    return events;
  }

  async filterEvents(
    province: string,
    city: string,
    category: string,
    date: string,
  ): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: {
        AND: [
          { location: { contains: province } },
          { location: { contains: city } },
          { category: { category_name: { contains: category } } },
          { start_date: new Date(date) },
        ],
      },
    });

    return events;
  }

  async approveEvent(eventId: number, approve: ApproveEventDto): Promise<any> {
    const existingEvent = await this.prisma.event.findUnique({
      where: { id: +eventId },
    });
    if (!existingEvent) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // console.log(approve);

    if (approve.verified === true) {
      const approvedEvent = await this.prisma.event.update({
        where: { id: +eventId },
        data: { verified: true },
      });

      return { approved: true, event: approvedEvent };
    }

    // Return response if approve is false
    return { approved: false, message: 'Event not approved' };
  }
}
