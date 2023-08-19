import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDate } from 'class-validator';

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    title: string;
  
    @IsOptional()
    @IsString()
    description?: string;
  
    @IsNotEmpty()
    @IsDate()
    event_date: Date;
  
    @IsNotEmpty()
    @IsString()
    location: string;
  
    @IsNotEmpty()
    @IsNumber()
    ticket_total: number;
  
    @IsNotEmpty()
    @IsNumber()
    category_id: number;
  
    @IsNotEmpty()
    @IsNumber()
    organizer_id: number;
}