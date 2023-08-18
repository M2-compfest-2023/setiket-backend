import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@/providers/prisma";
import { UsersService } from "@modules/users";
import { UserLoginDto } from "./dtos/user-login.dto";
import * as bcrypt from 'bcrypt';
import { UserRegisterDto } from "./dtos/user-register.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaservice: PrismaService,
        private jwtService: JwtService,
        private readonly userService: UsersService
    ) { }

    async login (loginDto: UserLoginDto):Promise<any> {
        const { username, password } = loginDto;

        const user = await this.prismaservice.users.findUnique({
            where: {
                username: username
            }
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        const validatePassword = await bcrypt.compare(password, user.password);

        if (!validatePassword) {
            throw new NotFoundException("Wrong password");
        }

        return {
            access_token: this.jwtService.sign({ username: user.username })
        }
    }

    async register (registerDto: UserRegisterDto):Promise<any> {
        const { name, username, password, email, user_type } = registerDto;

        const user = await this.prismaservice.users.findUnique({
            where: {
                username: username
            }
        });

        if (user) {
            throw new NotFoundException("User already exists");
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await this.prismaservice.users.create({
            data: {
                name: name,
                username: username,
                password: hashPassword,
                email: email,
                user_type: user_type
            }
        });

        return {
            access_token: this.jwtService.sign({ username: newUser.username })
        }
    }
}
