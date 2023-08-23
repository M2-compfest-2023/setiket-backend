// src/events/dto/update-event.dto.ts
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  IsDateString,
} from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  start_date?: Date;

  @IsOptional()
  @IsDateString()
  end_date?: Date;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  ticket_total?: number;

  @IsOptional()
  @IsInt()
  category_id?: number;

  // @IsOptional()
  // @IsBoolean()
  // verified?: boolean;
}
