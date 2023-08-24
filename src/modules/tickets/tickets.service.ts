import { PrismaService } from '@/providers/prisma';
import { Ticket } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dtos/create-ticket.dto';

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



    // const { quantity, customer_id, event_id } = ticketData;

    // const ticket = await this.prismaService.ticket.create({
    //   data: {
    //     quantity,
    //     customer_id,
    //     event_id,
    //   },
    // });

    // return ticket;

    // return this.prismaService.$transaction(async (prisma) => {
    //   const { quantity, customer_id, event_id } = ticketData;

    //   const ticket = await prisma.ticket.create({
    //     data: {
    //       quantity,
    //       customer_id,
    //       event_id,
    //     },
    //   });

    //   // error gak jelas padahal quantity sudah engga ada di schema prisma
    //   // for (let i = 0; i < +purchases_ticket; i++) {
    //   //   await prisma.ticket.create({
    //   //     data: {
    //   //       event_id,
    //   //       customer_id,
    //   //       ticket_purchase_id: ticketPurchase.id,
    //   //     },
    //   //   });
    //   // }

    //   // const tickets: Prisma.TicketCreateManyInput[] = [];
    //   // for (let i = 0; i < +purchases_ticket; i++) {
    //   //   tickets.push({
    //   //       event_id,
    //   //       customer_id,
    //   //       ticket_purchase_id: ticketPurchase.id,
    //   //   });
    //   // }

    //   // await prisma.ticket.createMany({
    //   //   data: tickets,
    //   // });

    //   return ticket;
    // });
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
