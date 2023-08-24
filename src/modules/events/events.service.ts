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

  async getEventSales(eventId: number): Promise<any> {
    const event = await this.prisma.event.findUnique({
      where: { id: +eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const sales = await this.prisma.ticket.findMany({
      where: { event_id: +event.id },
    });    

    return sales;
  }

  async getEventByUser(id: string): Promise<Event[]> {
    const customer = await this.prisma.customer.findUnique({
      where: { user_id: id },
    });
  
    const tickets = await this.prisma.ticket.findMany({
      where: { customer_id: customer.id },
    });
  
    if (!tickets || tickets.length === 0) {
      throw new NotFoundException(`No events found for user with ID ${id}`);
    }
  
    const uniqueEventIds = Array.from(new Set(tickets.map((ticket) => ticket.event_id)));

    const uniqueEventIdsAsInt = uniqueEventIds.map((eventId) => eventId as number);

    const events = await this.prisma.event.findMany({
      where: { id: { in: uniqueEventIdsAsInt } },
    });
  
    return events;
  }

  async createEvent(eventData: CreateEventDto, id: string): Promise<any> {
    const organizer = await this.prisma.eventOrganizer.findUnique({
      where: { user_id: id },
    });

    console.log(organizer);

    const {
      title,
      description,
      start_date,
      end_date,
      location,
      city_id,
      ticket_total,
      category_id,
    } = eventData;

    const event = await this.prisma.event.create({
      data: {
        title,
        description,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        location,
        city_id,
        ticket_total,
        category_id,
        organizer_id: organizer.id,
        verified: false,
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
    province: string | null,
    city: string | null,
    category: string | null,
    start_date: string | null,
    end_date: string | null,
  ): Promise<Event[]> {
    const where: {
      [key: string]: any;
    }[] = [];

    if (province) {
      where.push({ location: { contains: province } });
    }

    if (city) {
      where.push({ location: { contains: city } });
    }

    if (category) {
      where.push({ category: { category_name: { contains: category } } });
    }

    if (start_date) {
      where.push({ start_date: new Date(start_date) });
    }

    if (end_date) {
      where.push({ end_date: new Date(end_date) });
    }

    const events = await this.prisma.event.findMany({
      where: {
        AND: where,
      },
    });

    // const events = await this.prisma.event.findMany({
    //   where: {
    //     AND: [
    //       { location: { contains: province } },
    //       { location: { contains: city } },
    //       { category: { category_name: { contains: category } } },
    //       { start_date: new Date(start_date) },
    //       { end_date: new Date(end_date) },
    //     ],
    //   },
    // });

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
