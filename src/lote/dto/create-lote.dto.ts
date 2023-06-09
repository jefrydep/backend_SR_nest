import { IsOptional, IsString, isString } from 'class-validator';

export class CreateLoteDto {
  @IsString()
  loteCode: string;

  @IsString()
  loteState: string;

  @IsString()
  aream2: string;

  @IsString()
  price: string;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  partidNumber?: string;
}
