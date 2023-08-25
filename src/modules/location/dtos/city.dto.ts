import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CityParam {
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @IsOptional()
    @ApiPropertyOptional({
        example: 12,
    })
    province_id: number;
}
