import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    example: 'Event Title',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Event Description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    // example: '2021-01-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  start_date: Date;

  @ApiProperty({
    // example: '2021-01-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  end_date: Date;

  @ApiProperty({
    example: 'Event Location',
  })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({
    example: 1101,
  })
  @IsNotEmpty()
  @IsNumber()
  city_id: number;

  @ApiProperty({
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  ticket_total: number;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  category_id: number;
}
