import { IsString, Length } from "class-validator";


export class UserLoginDto {
    @IsString()
    @Length(5, 20)
    username: string;

    @IsString()
    @Length(6, 12)
    password: string;
} 