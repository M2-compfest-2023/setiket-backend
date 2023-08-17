import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "@/providers/prisma";
import { JwtStrategy } from "./jwt.strategy";
import { UsersService } from "@modules/users";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "@modules/users";

@Module({
    controllers: [AuthController],
    providers: [AuthService, PrismaService, JwtStrategy, UsersService],
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }
        })
    ],
})
export class AuthModule {}
