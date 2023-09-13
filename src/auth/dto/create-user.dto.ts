import {
  IsArray,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  isString,
  minLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  name: string;

  @MaxLength(20)
  @IsString()
  address: string;

  @MaxLength(12)
  @MinLength(9)
  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(8)
  documentNumber: string;

  @IsString()
  @MinLength(6)
  @MaxLength(30)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;
}
