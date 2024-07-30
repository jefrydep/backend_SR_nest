import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  isArray,
  isObject,
  isString,
} from 'class-validator';
import { Sale } from 'src/venta/entities/venta.entity';
import { OneToOne } from 'typeorm';

export class CreateLoteDto {
  @IsString()
  loteCode: string;

  // @IsString()
  
  @IsIn(['Disponible', 'Reservado', 'Vendido', 'Observado'])
  loteState: string;

  @IsString()
  aream2: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  cost: number;

  @IsString()
  frontSide: string;

  @IsString()
  leftSide: string;

  @IsString()
  rightSide: string;

  @IsString()
  depthSide: string;

  @IsString()
  @IsOptional()
  partidNumber: string;

  @IsNotEmpty()
  blockId: string;

  @IsBoolean()
  @IsOptional()
  isSold: boolean = false;
}
