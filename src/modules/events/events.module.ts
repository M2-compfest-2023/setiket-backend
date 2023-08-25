import { Module } from '@nestjs/common';

import { PrismaService } from '@/providers/prisma';

import { EventController } from './events.controller';
import { EventService } from './events.service';

@Module({
    controllers: [EventController],
    providers: [EventService, PrismaService],
})
export class EventModule {}
