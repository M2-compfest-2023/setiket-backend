import { PrismaService } from '@/providers/prisma';
import { Ticket } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TicketsService {
  constructor(private prismaService: PrismaService) { }

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
  ): Promise<Ticket> {
    return this.prismaService.$transaction(async (prisma) => {
      const event = await prisma.event.findUnique({
        where: {
          id: +ticketData.event_id,
        },
      });

      if (!event) {
        throw new NotFoundException(`Event with ID ${ticketData.event_id} not found`);
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

      if (event.ticket_total <= ticketData.quantity + totalPurchasesTicket) {
        throw new NotFoundException(`Event with ID ${ticketData.event_id} is out of stock`);
      }

      const { quantity, customer_id, event_id } = ticketData;

      const ticket = await prisma.ticket.create({
        data: {
          quantity,
          customer_id,
          event_id,
        },
      });

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
