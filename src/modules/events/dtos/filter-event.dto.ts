import { ApiPropertyOptional } from '@nestjs/swagger';
// import { IsDateString, IsString } from 'class-validator';

export class FilterEventDto {
    @ApiPropertyOptional({
        required: false,
    })
    province: string;

    @ApiPropertyOptional({
        required: false,
    })
    city: string;

    @ApiPropertyOptional({
        required: false,
    })
    category: string;

    @ApiPropertyOptional({
        required: false,
        example: '2021-01-01T00:00:00.000Z',
    })
    // @IsDateString()
    start_date: Date;

    @ApiPropertyOptional({
        required: false,
        example: '2021-01-01T00:00:00.000Z',
    })
    // @IsDateString()
    end_date: Date;
}
