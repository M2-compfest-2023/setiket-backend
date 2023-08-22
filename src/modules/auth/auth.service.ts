import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/providers/prisma';
import { UserLoginDto } from './dtos/login.dto';
import { UserRegisterDto } from './dtos/register.dto';
import { EoRegisterDto } from './dtos/register.dto';
import { comparePassword, hashPassword } from '@/common/helpers/hash.helper';
import { CustomException } from '@/response/CustomException';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: UserLoginDto) {
    const { email, password } = loginDto;

    const user = await this.prismaService.users.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new CustomException('Email/password not valid', 400);
    }

    const validatePassword = await comparePassword(password, user.password);

    if (!validatePassword) {
      throw new CustomException('Email/password not valid', 400);
    }

    return {
      access_token: this.jwtService.sign({ username: user.username }),
    };
  }

  async registerCustomer(registerDto: UserRegisterDto) {
    const { username, name, email, password } = registerDto;

    const user = await this.prismaService.users.findUnique({
      where: {
        username: username,
      },
    });

    if (user) {
      throw new NotFoundException('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.prismaService.users.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword,
        user_type: 'CUSTOMER',
      },
    });

    return {
      access_token: this.jwtService.sign({ username: newUser.username }),
    };
  }

  async registerEo(registerDto: EoRegisterDto) {
    const { username, name, email, password, organizationName } = registerDto;

    const user = await this.prismaService.users.findUnique({
      where: {
        username: username,
      },
    });

    if (user) {
      throw new NotFoundException('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await this.prismaService.users.create({
      data: {
        username,
        name,
        email,
        password: hashedPassword,
        user_type: 'CUSTOMER',
        eventOrganizers: {
          create: {
            organization_name: organizationName,
          },
        },
      },
    });

    return {
      access_token: this.jwtService.sign({ username: newUser.username }),
    };
  }
}
