import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/providers/prisma';
import { UsersService } from '@modules/users';
import { UserLoginDto } from './dtos/user-login.dto';
import * as bcrypt from 'bcrypt';
import { UserRegisterDto } from './dtos/user-register.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async login(loginDto: UserLoginDto): Promise<any> {
    const { username, password } = loginDto;

    const user = await this.prismaService.users.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const validatePassword = await bcrypt.compare(password, user.password);

    if (!validatePassword) {
      throw new NotFoundException('Wrong password');
    }

    return {
      access_token: this.jwtService.sign({ username: user.username }),
    };
  }

  async register(registerDto: UserRegisterDto): Promise<any> {
    const { name, username, password, email } = registerDto;

    const user = await this.prismaService.users.findUnique({
      where: {
        username: username,
      },
    });

    if (user) {
      throw new NotFoundException('User already exists');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prismaService.users.create({
      data: {
        name: name,
        username: username,
        password: hashPassword,
        email: email,
        user_type: 'CUSTOMER',
      },
    });

    if (!newUser) {
      throw new NotFoundException('Failed to create user');
    }

    return {
      access_token: this.jwtService.sign({ username: newUser.username }),
    };
  }
}
