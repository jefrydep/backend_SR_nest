import {
  MinLength,
  IsString,
  isString,
  IsOptional,
  IsDate,
  IsIn,
} from 'class-validator';

export class CreateCorporationDto {
  @IsString()
  @MinLength(5)
  fullName: string;

  @IsString()
  birthdayDate: string;

  @IsString()
  dni: string;

  @IsString()
  @IsOptional()
  ruc?: string;

  @IsString()
  @IsOptional()
  cellNumber?: string;

  @IsIn(['Masculino', 'Femenino', 'Unisex'])
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

  @IsString()
  country: string;

  @IsString()
  maritalStatus: string;

  @IsString()
  @IsOptional()
  beneficiary: string;

  @IsString()
  @IsOptional()
  observations: string;

  @IsString()
  @IsOptional()
  nameSpouse: string;

  @IsString()
  @IsOptional()
  dniSpouse: string;

  @IsString()
  @IsOptional()
  genderSpouse: string;

  @IsString()
  @IsOptional()
  cellNumberSpouse: string;

  @IsString()
  @IsOptional()
  birthdayDateSpouse: string;
}
