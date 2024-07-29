import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateLoteDto } from 'src/lot/dto/create-lote.dto';

export class CreateBlockDto {
  @IsString()
  block: string;

  // @IsString()
  // @IsOptional()
  // aream2?: string;
  
  @IsString()
  @IsOptional()
  description?: string;


  @IsNotEmpty()
  projectId: string;


  
  @IsOptional()
  lots?:CreateLoteDto[];
}
