import { AuthService } from './auth.service';
import { Controller, Post, Body, Req, Res, UseGuards, Request } from '@nestjs/common';
import { UserLoginDto } from './dtos/login.dto';
import { Response } from 'express';
import { EoRegisterDto, UserRegisterDto } from './dtos/register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { JwtService } from '@nestjs/jwt';
import { Token } from '@/common/decorators/token.decorators';
import { PrismaService } from '@/providers/prisma';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  @Post('login')
  async login(@Req() _: Request, @Res() res: Response, @Body() loginDto: UserLoginDto) {
    try {
      const login = await this.authService.login(loginDto);
      return res.status(200).json({
        message: 'Login success',
        data: login,
      });
    } catch (error) {
      return res.status(404).json({
        message: 'Login failed',
        error: error.message,
      });
    }
  }

  @Post('register/customer')
  async registerCustomer(
    @Req() _: Request,
    @Res() res: Response,
    @Body() registerDto: UserRegisterDto,
  ) {
    try {
      const register = await this.authService.registerCustomer(registerDto);
      return res.status(200).json({
        message: 'Register success',
        data: register,
      });
    } catch (error) {
      return res.status(404).json({
        message: 'Register failed',
        error: error.message,
      });
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
      return res.status(404).json({
        message: 'Register failed',
        error: error.message,
      });
    }
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async validateToken(@Token('username') username: string, @Res() res: Response) {
    try {
      const user = await this.prismaService.users.findUnique({
        where: {
          username,
        },
      });
      return res.status(200).json({
        message: 'Token valid',
        data: {
          id: user.id,
          username,
          role: user.user_type,
        },
      });
    } catch (error) {
      return res.status(404).json({
        message: 'Register failed',
        error: error.message,
      });
    }
  }
}
