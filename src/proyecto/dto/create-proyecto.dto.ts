import { IsString, isString } from "class-validator";

export class CreateProyectoDto {

@IsString()
nameProject:string

@IsString()
location:string

@IsString()
aream2:string;

@IsString()
abbrevation:string;



}
