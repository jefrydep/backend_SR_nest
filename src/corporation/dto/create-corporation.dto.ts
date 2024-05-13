import {
  MinLength,
  IsString,
  isString,
  IsOptional,
  IsDate,
  IsIn,
  MaxLength,
  IsEmail,
  maxLength,
} from 'class-validator';

export class CreateCorporationDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @MaxLength(50)
  @IsOptional()
  fullDescription?: string;

  @IsString()
  @IsOptional()
  ruc?: string;

  @IsString()
  @IsOptional()
  cellNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  department: string;

  @IsString()
  province: string;

  @IsString()
  country: string;

  @IsEmail()
  @IsString()
  email: string;

  @MaxLength(50)
  @IsString()
  webSite: string;

  @MaxLength(20)
  @IsString()
  manager: string;

  @IsString()
  logo: string;
}
