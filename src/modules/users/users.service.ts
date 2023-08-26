import { Injectable } from '@nestjs/common';

import { CustomException } from '@/common/response/CustomException';
import { PrismaService } from '@/providers/prisma';

@Injectable()
export class UsersService {
    constructor(private prismaService: PrismaService) {}

    async getAllUsers() {
        const users = await this.prismaService.users.findMany({
            select: {
                username: true,
                id: true,
                name: true,
                email: true,
                user_type: true,
                eventOrganizers: {
                    select: {
                        verified: true,
                    },
                },
            },
        });

        const res = users.map((u) => ({
            username: u.username,
            id: u.id,
            name: u.name,
            email: u.email,
            user_type: u.user_type,
            verified: u.eventOrganizers[0],
        }));

        res.map((u) => {
            if (u.user_type != 'EVENTORGANIZER') {
                u.verified = {
                    verified: true,
                };
            }
        });

        return res;
    }

    async getDetailUser(user_id: string) {
        const user = await this.prismaService.users.findFirst({
            where: {
                id: user_id,
            },
            select: {
                username: true,
                id: true,
                name: true,
                email: true,
                user_type: true,
                eventOrganizers: {
                    select: {
                        verified: true,
                    },
                },
            },
        });

        if (!user) throw new CustomException('User not found', 404);

        const resUser = {
            username: user.username,
            id: user.id,
            name: user.name,
            email: user.email,
            user_type: user.user_type,
            verified: user.eventOrganizers[0].verified,
        };

        return resUser;
    }

    async getActivities() {
        const tickets = await this.prismaService.ticket.findMany({
            include: {
                event: true,
                customer: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        const buyTicketActivity = tickets.map((u) => ({
            meesage: `${u.customer.user.name} bought ${u.quantity} tickets of ${u.event.title}`,
            timestamp: u.created_at.toLocaleString(),
        }));

        const events = await this.prismaService.event.findMany({
            include: {
                organizer: true,
            },
        });

        const createEventActivity = events.map((u) => ({
            message: `${u.organizer.organization_name} created event ${u.title}`,
            timestamp: u.created_at.toLocaleString(),
        }));

        return [...createEventActivity, ...buyTicketActivity];
    }

    async getUserActivity(user_id: string) {
        const userTickets = await this.prismaService.ticket.findMany({
            where: {
                customer: {
                    user_id: user_id,
                },
            },
            include: {
                event: true,
                customer: true,
            },
        });

        if (!userTickets)
            throw new CustomException('Customer user not found', 404);

        const result = userTickets.map((u) => ({
            eventName: u.event.title,
            timeStamp: u.created_at.toLocaleString(),
        }));

        return result;
    }

    async approveEo(user_id: string, approve?: boolean) {
        const eoUser = await this.prismaService.eventOrganizer.findFirst({
            where: {
                user_id: user_id,
            },
        });
        if (!eoUser)
            throw new CustomException('Event organizer user not found', 404);
        // if(eoUser.verified) throw new CustomException('Event organizer user already verified', 400)
        const updatedUser = await this.prismaService.eventOrganizer.update({
            where: {
                id: eoUser.id,
            },
            data: {
                verified: approve ?? null,
            },
        });

        return {
            id: updatedUser.user_id,
            verified: updatedUser.verified,
        };
    }

    async isUserExist(user_id: string) {
        const user = await this.prismaService.users.findFirst({
            where: {
                id: user_id,
            },
        });

        if (!user) throw new CustomException('User not found', 404);
    }
}
