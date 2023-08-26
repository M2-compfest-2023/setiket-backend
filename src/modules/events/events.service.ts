import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Event } from '@prisma/client';

import { PrismaService } from '@/providers/prisma';

import { ApproveEventDto } from './dtos/approve-event.dto';
import { CreateEventDto } from './dtos/create-event.dto';
import { FilterEventDto } from './dtos/filter-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';

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

    async getEventSales(eventId: number) {
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
            throw new NotFoundException(
                `No events found for user with ID ${id}`,
            );
        }

        const uniqueEventIds = Array.from(
            new Set(tickets.map((ticket) => ticket.event_id)),
        );

        const uniqueEventIdsAsInt = uniqueEventIds.map(
            (eventId) => eventId as number,
        );

        const events = await this.prisma.event.findMany({
            where: { id: { in: uniqueEventIdsAsInt } },
        });

        return events;
    }

    async createEvent(eventData: CreateEventDto, id: string) {
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

    async filterEvents(filterEvent: FilterEventDto): Promise<Event[]> {
        const query = {};

        if (filterEvent.province) {
            const cities = await this.prisma.city.findMany({
                where: { province_id: +filterEvent.province },
            });

            const cityIds = cities.map((city) => city.id);

            query['city_id'] = { in: cityIds };
        }

        if (filterEvent.city) {
            const city = await this.prisma.city.findFirst({
                where: { id: +filterEvent.city },
            });

            query['city_id'] = city.id;
        }

        if (filterEvent.category) {
            const category = await this.prisma.category.findFirst({
                where: { id: +filterEvent.category },
            });

            query['category_id'] = category.id;
        }

        if (filterEvent.start_date) {
            const events = await this.prisma.event.findMany({
                where: {
                    start_date: {
                        gte: new Date(filterEvent.start_date),
                    },
                },
            });

            const eventIds = events.map((event) => event.id);

            query['id'] = { in: eventIds };
        }

        if (filterEvent.end_date) {
            const events = await this.prisma.event.findMany({
                where: {
                    end_date: {
                        lte: new Date(filterEvent.end_date),
                    },
                },
            });

            const eventIds = events.map((event) => event.id);

            query['id'] = { in: eventIds };
        }

        const events = await this.prisma.event.findMany({
            where: query,
        });

        return events;
    }

    async approveEvent(eventId: number, approve: ApproveEventDto) {
        const existingEvent = await this.prisma.event.findUnique({
            where: { id: +eventId },
        });
        if (!existingEvent) {
            throw new NotFoundException(`Event with ID ${eventId} not found`);
        }

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
