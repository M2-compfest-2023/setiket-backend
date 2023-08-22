import { AuthService } from './auth.service';
import { Controller, Post, Body, Req, Res, UseGuards, Request, InternalServerErrorException } from '@nestjs/common';
import { UserLoginDto } from './dtos/login.dto';
import { Response } from 'express';
import { EoRegisterDto, UserRegisterDto } from './dtos/register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { Token } from '@/common/decorators/token.decorators';
import { PrismaService } from '@/providers/prisma';
import { sendSuccess } from '@/response/ApiResponse';
import { CustomException } from '@/response/CustomException';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  @Post('login')
  async login(@Req() _: Request, @Body() loginDto: UserLoginDto) {
    try {
      const login = await this.authService.login(loginDto);
      return sendSuccess('Login success', 200, login);
    } catch (error) {
      if (error.status) throw new CustomException(error.message, error.status);
      else throw new InternalServerErrorException(error);
    }
  }

  @Post('register/customer')
  async registerCustomer(
    @Req() _: Request,
    @Body() registerDto: UserRegisterDto,
  ) {
    try {
      const register = await this.authService.registerCustomer(registerDto);
      sendSuccess('Register success', 201, register)
    } catch (error) {
      if (error.status) throw new CustomException(error.message, error.status);
      else throw new InternalServerErrorException(error);
    }
  }

  @Post('register/eo')
  async registerEo(@Req() _: Request, @Res() res: Response, @Body() registerDto: EoRegisterDto) {
    try {
      const register = await this.authService.registerEo(registerDto);
      return res.status(200).json({
        message: 'Register success',
        data: register,
      });
    } catch (error) {
      if (error.status) throw new CustomException(error.message, error.status);
      else throw new InternalServerErrorException(error);
    }
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async validateToken(@Token('id') id: string, @Res() res: Response) {
    try {
      const user = await this.prismaService.users.findUnique({
        where: {
          id,
        },
      });
      return res.status(200).json({
        message: 'Token valid',
        data: {
          id: user.id,
          usermame : user.username,
          role: user.user_type,
        },
      });
    } catch (error) {
      if (error.status) throw new CustomException(error.message, error.status);
      else throw new InternalServerErrorException(error);
    }
  }
}
