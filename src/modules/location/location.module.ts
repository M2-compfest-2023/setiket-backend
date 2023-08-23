import { Module } from "@nestjs/common";
import { PrismaService } from "@/providers/prisma";
import { LocationController } from "./location.controller";
import { LocationService } from "./location.service";

@Module({
    controllers: [LocationController],
    providers: [LocationService, PrismaService],
})
export class LocationModule {}
