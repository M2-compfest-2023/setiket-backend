import { Controller, Post, Put, Body, Req, Res, Delete } from "@nestjs/common";
import { EventService } from "./events.service";
import { CreateEventDto } from "./dtos/create-event.dto";
import { Request, Response } from 'express';
import { UpdateEventDto } from "./dtos/update-event.dto";

@Controller('events')
export class EventController {
    constructor(private readonly eventsService: EventService) {}

    @Post()
    async createEvent(@Body() eventData: CreateEventDto, @Req() req:Request, @Res() res:Response):Promise<any> {
        try {
            const event = await this.eventsService.createEvent(eventData);
            return res.status(200).json({ message: 'Event created successfully', event });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }

    @Put()
    async updateEvent(@Body() eventData: UpdateEventDto, @Req() req:Request, @Res() res:Response):Promise<any> {
        try {
            const { event_id } = req.body;

            const event = await this.eventsService.updateEvent(event_id, eventData);
            return res.status(200).json({ message: 'Event updated successfully', event });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }

    @Delete()
    async deleteEvent(@Body() eventData: UpdateEventDto, @Req() req:Request, @Res() res:Response):Promise<any> {
        try {
            const { event_id } = req.body;

            const event = await this.eventsService.deleteEvent(event_id);
            return res.status(200).json({ message: 'Event deleted successfully', event });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error', error });
        }
    }
}