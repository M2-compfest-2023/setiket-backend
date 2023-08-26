import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
    @ApiProperty({
        example: 'testcustomer@gmail.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'password',
    })
    @IsString()
    // @Length(6, 12)
    password: string;
}
