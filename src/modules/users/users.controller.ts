import { Controller, Get, HttpCode, InternalServerErrorException, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserType } from '@prisma/client';
import { RoleGuard } from '@/common/guards/roles/role.guard';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '@/common/decorators/responseMessage.decorator';
import { CustomException } from '@/response/CustomException';

@Controller('users')
@ApiTags("Users")
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles(UserType.ADMIN)
    @UseGuards(JwtAuthGuard, RoleGuard)
    @ApiBearerAuth()
    @HttpCode(200)
    @ResponseMessage('Success get all users')
    async getAllUsers() {
      try {
        const users = await this.usersService.getAllUsers();
        console.log(users)
        return users
      } catch (error) {
        if (error.status) throw new CustomException(error.message, error.status);
        else throw new InternalServerErrorException(error);
      }
    }
}
