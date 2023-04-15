import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
 
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
