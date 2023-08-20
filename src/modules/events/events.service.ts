import { PrismaService } from "@/providers/prisma";
import { Injectable } from "@nestjs/common";
import { CreateEventDto } from "./dtos/create-event.dto";
import { UpdateEventDto } from "./dtos/update-event.dto";
import { Event } from "@prisma/client";
import { NotFoundException } from "@nestjs/common";

@Injectable()
export class EventService {
    constructor(private readonly prisma: PrismaService) {}

    async createEvent(eventData: CreateEventDto):Promise<any> {
        const { title, description, event_date, location, ticket_total, category_id, organizer_id } = eventData;

        const event = await this.prisma.event.create({
            data: {
                title,
                description,
                event_date: new Date(event_date),
                location,
                ticket_total,
                category_id,
                organizer_id,
                verified: false
            }
        });

        return event;
    }

    async updateEvent(eventId: number, eventData: UpdateEventDto): Promise<Event> {
        const existingEvent = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!existingEvent) {
          throw new NotFoundException(`Event with ID ${eventId} not found`);
        }
    
        const updatedEvent = await this.prisma.event.update({
          where: { id: eventId },
          data: eventData,
        });
    
        return updatedEvent;
    }

    async deleteEvent(eventId: number): Promise<Event> {
        const existingEvent = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!existingEvent) {
          throw new NotFoundException(`Event with ID ${eventId} not found`);
        }
    
        const deletedEvent = await this.prisma.event.delete({
          where: { id: eventId },
        });
    
        return deletedEvent;
      }
}