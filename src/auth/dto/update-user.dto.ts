import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './login-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
