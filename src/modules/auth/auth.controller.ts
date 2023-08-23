import { AuthService } from './auth.service';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UserLoginDto } from './dtos/login.dto';
import { EoRegisterDto, UserRegisterDto } from './dtos/register.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt';
import { Token } from '@/common/decorators/token.decorator';
import { PrismaService } from '@/providers/prisma';
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
    const login = await this.authService.login(loginDto);
    return login;
  }

  @Post('register/customer')
  @HttpCode(201)
  @ResponseMessage('Success create new customer')
  async registerCustomer(@Body() registerDto: UserRegisterDto) {
    const register = await this.authService.registerCustomer(registerDto);
    return register;
  }

  @Post('register/eo')
  @HttpCode(201)
  @ResponseMessage('Success create new event organizer')
  async registerEo(@Body() registerDto: EoRegisterDto) {
    const register = await this.authService.registerEo(registerDto);
    return register;
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ResponseMessage('Token valid')
  async validateToken(@Token('id') id: string) {
    const user = await this.prismaService.users.findUnique({
      where: {
        id,
      },
    });

    const { username, user_type } = user;
    return {
      username,
      id,
      role: user_type,
    };
  }
}
