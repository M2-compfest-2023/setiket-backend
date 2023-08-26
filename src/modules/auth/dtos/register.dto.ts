import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDto {
    @ApiProperty({
        example: 'new user',
    })
    @IsString()
    // @Length(5, 10)
    username: string;

    @ApiProperty({
        example: 'password',
    })
    @IsString()
    // @Length(6, 12)
    password: string;

    @ApiProperty({
        example: 'Use new',
    })
    @IsString()
    // @Length(5, 10)
    name: string;

    @ApiProperty({
        example: 'newuser@gmail.com',
    })
    @IsEmail()
    email: string;
}

export class EoRegisterDto extends UserRegisterDto {
    @ApiProperty({
        example: 'Compfest 15',
    })
    @IsString()
    // @Length(5, 64)
    organizationName: string;
}
