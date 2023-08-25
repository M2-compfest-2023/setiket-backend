import { Module } from '@nestjs/common';

import { PrismaService } from '@/providers/prisma';

import { UsersService } from '../users';
import { NotifyController } from './notify.controller';
import { NotifyService } from './notify.service';

@Module({
    controllers: [NotifyController],
    providers: [NotifyService, PrismaService, UsersService],
})
export class NotifyModule {}
