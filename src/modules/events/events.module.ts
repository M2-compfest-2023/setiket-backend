import { Module } from '@nestjs/common';
import { EventController } from './events.controller';
import { EventService } from './events.service';
import { PrismaService } from '@/providers/prisma';
import { NotifyService } from '../notify/notify.service';
import { NotifyController } from '../notify/notify.controller';

@Module({
  controllers: [EventController],
  providers: [EventService, PrismaService],
})
export class EventModule {}
