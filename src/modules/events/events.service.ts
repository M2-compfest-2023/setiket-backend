import { PrismaService } from '@/providers/prisma';
import { Injectable, ParseBoolPipe } from '@nestjs/common';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { Event } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { ApproveEventDto } from './dtos/approve-event.dto';
import { FilterEventDto } from './dtos/filter-event.dto';

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

    const city = await this.prisma.city.findUnique({
      where: { id: +event.city_id },
    });

    const province = await this.prisma.province.findUnique({
      where: { id: +city.province_id },
    });

    const soldTickets = await this.prisma.ticket.findMany({
      where: { event_id: +event.id },
    });

    let totalSoldTickets = 0;
    for (let i = 0; i < soldTickets.length; i++) {
      totalSoldTickets += soldTickets[i].quantity;
    }

    const eventWithCity = {
      ...event,
      province: province.name,
      city: city.name,
      sold_tickets: totalSoldTickets,
    };

    return eventWithCity;
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

    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.user_type === 'EVENTORGANIZER') {
      const organizer = await this.prisma.eventOrganizer.findUnique({
        where: { user_id: id },
      });
    
      const events = await this.prisma.event.findMany({
        where: { organizer_id: organizer.id },
      });
    
      return events;
    }

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

    const {
      title,
      description,
      start_date,
      end_date,
      location,
      city_id,
      ticket_total,
      category_id,
      price,
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
        price,
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
      filterEvent: FilterEventDto
    ): Promise<Event[]> {
      const query = {}

      if (filterEvent.province) {
        query['province'] = filterEvent.province
      }

      if (filterEvent.city) {
        query['city'] = filterEvent.city
      }

      if (filterEvent.category) {
        query['category'] = filterEvent.category
      }

      if (filterEvent.start_date) {
        query['start_date'] = filterEvent.start_date
      }

      if (filterEvent.end_date) {
        query['end_date'] = filterEvent.end_date
      }

      const events = await this.prisma.event.findMany({
        where: query,
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
