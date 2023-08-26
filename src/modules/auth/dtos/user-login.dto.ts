import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserLoginDto {
    @ApiProperty()
    @IsString()
    // @Length(5, 20)
    username: string;

    @ApiProperty()
    @IsString()
    // @Length(6, 12)
    password: string;
}
