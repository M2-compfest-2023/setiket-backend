import { Module } from '@nestjs/common';

import { MailingService } from '@/providers/mail/mail.service';
import { PrismaService } from '@/providers/prisma';

import { TicketController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
    controllers: [TicketController],
    providers: [TicketsService, PrismaService, MailingService],
})
export class TicketsModule {}
