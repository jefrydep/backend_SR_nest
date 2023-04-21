import { MinLength, IsString, isString, IsOptional, IsDate, IsIn } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @MinLength(5)
  fullName: string;

  @IsString()
  age: string;
 
  @IsString()
  dni: string;

  @IsString()
  @IsOptional()
  ruc?: string;

  @IsString()
  @IsOptional()
  cellPhone?: string;
  
   @IsIn(['Masculino','Femenino','Unisex'])
  gender: string;
  
  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  department: string;

  @IsString()
  province: string;

  @IsString()
  distrit: string;
}
