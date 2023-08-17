import { AuthService } from "./auth.service";
import { Controller, Post, Body, Req, Res } from "@nestjs/common";
import { UserLoginDto } from "./dtos/user-login.dto";
import { Request, Response } from "express";
import { UserRegisterDto } from "./dtos/user-register.dto";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Req() req:Request, @Res() res:Response, @Body() loginDto:UserLoginDto):Promise<any> {
        try {
            const login = await this.authService.login(loginDto);
            return res.status(200).json({
                message: "Login success",
                data: login
            });
        } catch (error) {
            return res.status(404).json({
                message: "Login failed",
                error: error.message
            });
        }
    }

    @Post('register')
    async register(@Req() req:Request, @Res() res:Response, @Body() registerDto:UserRegisterDto):Promise<any> {
        try {
            const register = await this.authService.register(registerDto);
            return res.status(200).json({
                message: "Register success",
                data: register
            });
        } catch (error) {
            return res.status(404).json({
                message: "Register failed",
                error: error.message
            });
        }
    }

}
