import { ApiPropertyOptional, ApiQuery } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class FilterEventDto {
  @ApiPropertyOptional({
    required: false,
  })
  @IsString()
  province: string;

  @ApiPropertyOptional({
    required: false,
  })
  @IsString()
  city: string;

  @ApiPropertyOptional({
    required: false,
  })
  @IsString()
  category: string;

  @ApiPropertyOptional({
    required: false,
  })
  @IsDateString()
  start_date: Date;

  @ApiPropertyOptional({
    required: false,
  })
  @IsDateString()
  end_date: Date;
}