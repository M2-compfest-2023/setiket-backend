import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateTicketDto {
    @ApiProperty({
        example: 10,
    })
    @IsNumber()
    quantity: number;

    @ApiProperty({
        example: 1,
    })
    @IsNumber()
    event_id: number;
}
