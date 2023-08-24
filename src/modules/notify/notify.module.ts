import { Module } from "@nestjs/common";
import { PrismaService } from "@/providers/prisma";
import { NotifyController } from "./notify.controller";
import { NotifyService } from "./notify.service";
import { UsersService } from "../users";

@Module({
    controllers: [NotifyController],
    providers: [NotifyService, PrismaService, UsersService],
})
export class NotifyModule {}
