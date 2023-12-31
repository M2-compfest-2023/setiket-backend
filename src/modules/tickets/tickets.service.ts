import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Ticket } from '@prisma/client';

import { MailingService } from '@/providers/mail/mail.service';
import { PrismaService } from '@/providers/prisma';

import { CreateTicketDto } from './dtos/create-ticket.dto';

@Injectable()
export class TicketsService {
    constructor(
        private prismaService: PrismaService,
        private mailService: MailingService,
    ) {}

    async getPurchaseTicketByUserId(id: number): Promise<Ticket[]> {
        const ticketPurchase = await this.prismaService.ticket.findMany({
            where: {
                customer_id: +id,
            },
        });

        return ticketPurchase;
    }

    async createTicketPurchase(
        ticketData: CreateTicketDto,
        id: string,
    ): Promise<Ticket> {
        return this.prismaService.$transaction(async (prisma) => {
            const user = await prisma.customer.findUnique({
                where: {
                    user_id: id,
                },
            });

            const event = await prisma.event.findUnique({
                where: {
                    id: +ticketData.event_id,
                },
            });

            if (!event) {
                throw new NotFoundException(
                    `Event with ID ${ticketData.event_id} not found`,
                );
            }

            let totalPurchasesTicket = 0;
            const purchasesTicket = await prisma.ticket.findMany({
                where: {
                    event_id: +ticketData.event_id,
                },
            });

            for (let i = 0; i < purchasesTicket.length; i++) {
                totalPurchasesTicket += purchasesTicket[i].quantity;
            }

            if (
                event.ticket_total <=
                ticketData.quantity + totalPurchasesTicket
            ) {
                throw new NotFoundException(
                    `Event with ID ${ticketData.event_id} is out of stock`,
                );
            }

            const { quantity, event_id } = ticketData;

            const ticket = await prisma.ticket.create({
                data: {
                    quantity,
                    customer_id: user.id,
                    event_id,
                },
            });

            const userData = await prisma.users.findUnique({
                where: {
                    id: id,
                },
            });

            if (ticket) {
                await this.mailService.ticketPurchased(
                    userData.name,
                    userData.email,
                    event.title,
                );
            }

            return ticket;
        });
    }

    async deleteTicketPurchase(id: number): Promise<Ticket> {
        const ticket = await this.prismaService.ticket.delete({
            where: {
                id: +id,
            },
        });

        return ticket;
    }
}
