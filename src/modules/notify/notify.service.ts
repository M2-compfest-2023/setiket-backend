import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/providers/prisma';

import { UsersService } from '../users';

@Injectable()
export class NotifyService {
    constructor(
        private prismaService: PrismaService,
        private userService: UsersService,
    ) {}

    async getNotifyByUser(user_id: string) {
        return await this.prismaService.notify.findMany({
            where: {
                user_id,
            },
        });
    }

    async createNotify(user_id: string, message: string) {
        await this.userService.isUserExist(user_id);

        const newNotif = await this.prismaService.notify.create({
            data: {
                user_id: user_id,
                message,
            },
        });

        return newNotif;
    }
}
