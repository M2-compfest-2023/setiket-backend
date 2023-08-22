import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Body,
  Res,
  UseGuards,
  InternalServerErrorException,
  HttpCode,
} from '@nestjs/common';
import { UserLoginDto } from './dtos/login.dto';
import { Response } from 'express';
import { EoRegisterDto, UserRegisterDto } from './dtos/register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { Token } from '@/common/decorators/token.decorator';
import { PrismaService } from '@/providers/prisma';
import { CustomException } from '@/response/CustomException';
import { ResponseMessage } from '@/common/decorators/responseMessage.decorator';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ResponseMessage('Success login')
  async login(@Body() loginDto: UserLoginDto) {
    try {
      const login = await this.authService.login(loginDto);
      return login;
    } catch (error) {
      if (error.status) throw new CustomException(error.message, error.status);
      else throw new InternalServerErrorException(error);
    }
  }

  @Post('register/customer')
  @HttpCode(201)
  @ResponseMessage('Success create new customer')
  async registerCustomer(@Body() registerDto: UserRegisterDto) {
    try {
      const register = await this.authService.registerCustomer(registerDto);
      return register;
    } catch (error) {
      if (error.status) throw new CustomException(error.message, error.status);
      else throw new InternalServerErrorException(error);
    }
  }

  @Post('register/eo')
  @HttpCode(201)
  @ResponseMessage('Success create new event organizer')
  async registerEo(@Body() registerDto: EoRegisterDto) {
    try {
      const register = await this.authService.registerEo(registerDto);
      return register;
    } catch (error) {
      if (error.status) throw new CustomException(error.message, error.status);
      else throw new InternalServerErrorException(error);
    }
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ResponseMessage('Token valid')
  async validateToken(@Token('id') id: string, @Res() res: Response) {
    try {
      const user = await this.prismaService.users.findUnique({
        where: {
          id,
        },
      });
      return user
    } catch (error) {
      if (error.status) throw new CustomException(error.message, error.status);
      else throw new InternalServerErrorException(error);
    }
  }
}
