import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserLoginDto } from './dtos/user-login.dto';
import { Request, Response } from 'express';
import { UserRegisterDto } from './dtos/user-register.dto';
import { CustomException } from '@/response/CustomException';
import { sendSuccess } from '@/response/ApiResponse';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Req() _: Request, @Body() loginDto: UserLoginDto): Promise<any> {
    try {
      const login = await this.authService.login(loginDto);
      return sendSuccess('Login success', 200, login);
    } catch (error) {
      if (error.status) throw new CustomException(error.message, error.status);
      else throw new InternalServerErrorException(error);
    }
  }

  @Post('register')
  async register(
    @Req() _: Request,
    @Body() registerDto: UserRegisterDto,
  ): Promise<any> {
    try {
      const register = await this.authService.register(registerDto);
      return sendSuccess('Register success', 200, register);
    } catch (error) {
      if (error.status) throw new CustomException(error.message, error.status);
      else throw new InternalServerErrorException(error);
    }
  }
}
