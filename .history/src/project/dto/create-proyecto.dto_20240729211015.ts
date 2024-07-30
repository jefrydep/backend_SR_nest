import { IsOptional, IsString, isString } from 'class-validator';
import { CreateBlockDto } from 'src/block/dto/create-block.dto';
import { CreateVentaDto } from 'src/venta/dto/create-venta.dto';

export class CreateProyectoDto {
  @IsString()
  nameProject: string;

  @IsString()
  location: string;

  @IsString()
  aream2: string;

  // @IsString()
  // abbrevation:string;
  @IsString()
  status: string;

  @IsString()
  description: string;


  @IsOptional()
  blocks?: CreateBlockDto[];

  @IsOptional()
  sales?:CreateVentaDto[];

}
