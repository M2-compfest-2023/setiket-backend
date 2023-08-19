import { Injectable, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@/providers/prisma";
import { UsersService } from "@modules/users";
import { UserLoginDto } from "./dtos/user-login.dto";
import * as bcrypt from 'bcrypt';
import { UserRegisterDto } from "./dtos/user-register.dto";
import { Prisma } from "@prisma/client";
@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService,
        private readonly userService: UsersService
    ) { }

    async login (loginDto: UserLoginDto):Promise<any> {
        const { username, password } = loginDto;

        const user = await this.prismaService.users.findUnique({
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

    async register(registerDto: UserRegisterDto): Promise<any> {
        const { name, username, password, email, user_type } = registerDto;
    
        const hashPassword = await bcrypt.hash(password, 10);
    
        let newUser;
    
        // Define a transaction block
        const result = await this.prismaService.$transaction(async (prisma) => {
          const user = await prisma.users.findUnique({
            where: {
              username: username,
            },
          });
    
          if (user) {
            throw new NotFoundException('User already exists');
          }
    
          newUser = await prisma.users.create({
            data: {
              name: name,
              username: username,
              password: hashPassword,
              email: email,
              user_type: user_type,
            },
          });
    
          if (!newUser) {
            throw new NotFoundException('Failed to create user');
          }
    
          switch (user_type) {
            case 'event_organizer':
              await prisma.eventOrganizer.create({
                data: {
                    user_id: newUser.user_id,
                    verified: false
                },
              });
              break;
            case 'customer':
              await prisma.customer.create({
                data: {
                    user_id: newUser.user_id
                },
              });
              break;
            case 'admin':
              await prisma.administrator.create({
                data: {
                    user_id: newUser.user_id
                },
              });
              break;
            default:
              break;
          }
        });
    
        return {
          access_token: this.jwtService.sign({ username: newUser.username }),
        };
      }

    // async register (registerDto: UserRegisterDto):Promise<any> {
    //     const { name, username, password, email, user_type } = registerDto;

    //     const user = await this.prismaservice.users.findUnique({
    //         where: {
    //             username: username
    //         }
    //     });

    //     if (user) {
    //         throw new NotFoundException("User already exists");
    //     }

    //     const hashPassword = await bcrypt.hash(password, 10);

        

    //     const newUser = await this.prismaservice.users.create({
    //         data: {
    //             name: name,
    //             username: username,
    //             password: hashPassword,
    //             email: email,
    //             user_type: user_type
    //         }
    //     });

    //     if (!newUser) {
    //         throw new NotFoundException("Failed to create user");
    //     }

    //     switch (user_type) {
    //         case "event_organizer":
    //             await this.prismaservice.eventOrganizer.create({
    //                 data: {
    //                     user_id: newUser.user_id,
    //                     verified: false
    //                 }
    //             });
    //             break;
    //         case "customer":
    //             await this.prismaservice.customer.create({
    //                 data: {
    //                     user_id: newUser.user_id
    //                 }
    //             });
    //             break;
    //         case "admin":
    //             await this.prismaservice.administrator.create({
    //                 data: {
    //                     user_id: newUser.user_id
    //                 }
    //             });
    //             break;
    //         default:
    //             break;
    //     }

    //     return {
    //         access_token: this.jwtService.sign({ username: newUser.username })
    //     }
    // }
}
