import { Module } from "@nestjs/common";
import { EventController } from "./events.controller";
import { EventService } from "./events.service";
import { PrismaService } from "@/providers/prisma";

@Module({
    controllers: [EventController],
    providers: [EventService, PrismaService],
})

export class EventModule {}