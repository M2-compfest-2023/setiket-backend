import { Controller, Get, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async getAllUsers(@Req() req:Request, @Res() res:Response):Promise<any> {
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
