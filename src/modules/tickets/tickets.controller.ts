import { ApiTags } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import {
  Get,
  Post,
  Param,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { ResponseMessage } from '@/common/decorators/responseMessage.decorator';
import { CustomException } from '@/common/response/CustomException';
import { Prisma, UserType } from '@prisma/client';
import { RoleGuard } from '@/common/guards/roles/role.guard';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { Roles } from '@/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateTicketDto } from './dtos/create-ticket.dto';

@Controller('ticket')
@ApiTags('Tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketsService) {}

  @Get(':id')
  @Roles(UserType.CUSTOMER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ResponseMessage('Success get all tickets')
  async getPurchaseTicketByUserId(@Param('id') id: number): Promise<any> {
    try {
      const ticket = await this.ticketService.getPurchaseTicketByUserId(+id);
      return ticket;
    } catch (error) {
      if (error.status) throw new CustomException(error.message, error.status);
      else throw new InternalServerErrorException(error);
    }
  }

  @Post('purchase')
  @Roles(UserType.CUSTOMER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ResponseMessage('Success create ticket purchase')
  async createTicketPurchase(
    @Body() ticketData: CreateTicketDto,
  ): Promise<any> {
    try {
      const ticket = await this.ticketService.createTicketPurchase(ticketData);
      return ticket;
    } catch (error) {
      if (error.status) throw new CustomException(error.message, error.status);
      else throw new InternalServerErrorException(error);
    }
  }

  @Delete(':id')
  @Roles(UserType.CUSTOMER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ResponseMessage('Success delete ticket purchase')
  async deleteTicketPurchase(@Param('id') id: number): Promise<any> {
    try {
      const ticket = await this.ticketService.deleteTicketPurchase(+id);
      return ticket;
    } catch (error) {
      if (error.status) throw new CustomException(error.message, error.status);
      else throw new InternalServerErrorException(error);
    }
  }
}
