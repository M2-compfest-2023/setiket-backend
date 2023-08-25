import { Module } from '@nestjs/common';

import { PrismaService } from '@/providers/prisma';

import { TicketController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
    controllers: [TicketController],
    providers: [TicketsService, PrismaService],
})
export class TicketsModule {}
