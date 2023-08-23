import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(5, 20)
  name: string;

  @IsString()
  @Length(5, 100)
  description: string;
}