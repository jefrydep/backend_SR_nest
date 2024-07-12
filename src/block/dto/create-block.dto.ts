import { IsOptional, IsString } from 'class-validator';

export class CreateBlockDto {
  @IsString()
  block: string;

  @IsString()
  @IsOptional()
  aream2?: string;

  @IsString()
  description: string;
}
