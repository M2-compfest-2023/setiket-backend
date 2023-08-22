import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import { Roles } from '@/common/decorators/roles.decorators';
import { UserType } from '@prisma/client';
import { RoleGuard } from '@/common/guards/roles/role.guard';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags("Users")
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles(UserType.ADMIN)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @ApiBearerAuth()
    async getAllUsers(@Req() _:Request, @Res() res:Response):Promise<any> {
        try {
            const users = await this.usersService.getAllUsers();
            return res.status(200).json({
                data: users
            });
        } catch (error) {
            return res.status(404).json({
                message: "Users not found",
                error: error.message
            });
        }
    }
}
