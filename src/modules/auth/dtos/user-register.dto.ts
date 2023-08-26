import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
    @IsString()
    // @Length(5, 10)
    username: string;

    @IsString()
    // @Length(6, 12)
    password: string;

    @IsString()
    // @Length(5, 10)
    name: string;

    @IsEmail()
    email: string;
}
