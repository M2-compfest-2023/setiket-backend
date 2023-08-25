import { Body, Controller, Get, HttpCode, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserType } from '@prisma/client';
import { RoleGuard } from '@/common/guards/roles/role.guard';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from '@/common/decorators/responseMessage.decorator';
import { ApprovalEo } from './dtos/userEo.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ResponseMessage('Success get all users')
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }

  @Get('/:user_id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiParam({
    name : 'user_id',
    type : String,
    required : true,
    example : 'adaiorewoirqowerqwffjwojqfoieqjq'
  })
  @ResponseMessage('Success get detail user')
  async getDetailUser(@Param('user_id') user_id : string) {
    const users = await this.usersService.getDetailUser(user_id);
    return users;
  }

  @Get('/activity')
  @Roles(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @HttpCode(201)
  @ResponseMessage('Success get all activity')
  async getAllActivity() {
    const users = await this.usersService.getActivities();
    return users;
  }

  @Get('/activity/:user_id')
  @Roles(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @HttpCode(201)
  @ApiParam({
    name : 'user_id',
    type : String,
    required : true,
    example : 'adaiorewoirqowerqwffjwojqfoieqjq'
  })
  @ResponseMessage('Success get user activity')
  async getUserActivity(@Param('user_id') user_id : string) {
    const users = await this.usersService.getUserActivity(user_id);
    return users;
  }

  @Put('/eo/:user_id')
  @Roles(UserType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiBearerAuth()
  @ApiParam({
    name : 'user_id',
    type : String,
    required : true,
    example : 'ajdfoasdfoaiheiweorwejorwjerjwie'
  })
  @HttpCode(201)
  @ResponseMessage('Succes change status')
  async approveEo(@Param('user_id') user_id : string, @Body() body : ApprovalEo) {
    const verified = await this.usersService.approveEo(user_id, body.approve)
    return verified
  }
}
