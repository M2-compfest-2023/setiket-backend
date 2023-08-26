import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    InternalServerErrorException,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserType } from '@prisma/client';

import { ResponseMessage } from '@/common/decorators/responseMessage.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { Token } from '@/common/decorators/token.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { RoleGuard } from '@/common/guards/roles/role.guard';
import { CustomException } from '@/common/response/CustomException';

import { CreateTicketDto } from './dtos/create-ticket.dto';
import { TicketsService } from './tickets.service';

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
    async getPurchaseTicketByUserId(@Param('id') id: number) {
        try {
            const ticket = await this.ticketService.getPurchaseTicketByUserId(
                +id,
            );
            return ticket;
        } catch (error) {
            if (error.status)
                throw new CustomException(error.message, error.status);
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
        @Token('id') data: string,
    ) {
        try {
            const ticket = await this.ticketService.createTicketPurchase(
                ticketData,
                data,
            );
            return ticket;
        } catch (error) {
            if (error.status)
                throw new CustomException(error.message, error.status);
            else throw new InternalServerErrorException(error);
        }
    }

    @Delete(':id')
    @Roles(UserType.CUSTOMER)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    @ResponseMessage('Success delete ticket purchase')
    async deleteTicketPurchase(@Param('id') id: number) {
        try {
            const ticket = await this.ticketService.deleteTicketPurchase(+id);
            return ticket;
        } catch (error) {
            if (error.status)
                throw new CustomException(error.message, error.status);
            else throw new InternalServerErrorException(error);
        }
    }
}
