import {
  IsArray,
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
  isNotEmpty,
  isString,
  isUUID,
  minLength,
} from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Lot } from 'src/lot/entities/lote.entity';

export class CreateVentaDto {
  @IsString()
  saleType: string;
  //   tipodeventa contado|credito

  // fecha de venta
  @IsDateString()
  saleDate: Date;

  @IsNumber()
  @IsPositive()
  amount: number;
  //   importe de venta

  // observaciones
  @IsString()
  obserbations: string;

  // @IsNotEmpty()
  // userId: string;

  // numero de cuotas opcional si es al credito
  @IsOptional()
  @IsNumber()
  @IsPositive()
  installmentsNumber?: number;

  @IsString()
  bankName: string;

  // comprobante
  @IsString()
  receipt: string;

  // numero de comprobante
  @IsString()
  numberReceipt: string;

  // Forma de pago
  // pago con cheque,deposito banco,transferencia bancaria,pago efectivo,tarjeta de credito, tarjeta de debito

  @IsString()
  paymentMethod: string;

  // Código de operación
  @IsString()
  operationCode: string;

  @IsString()
  voucherImg: string;

  @IsOptional()
  @IsDateString()
  firstInstallmentDate?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  initial?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  remainingAmount?: number;

  @IsString()
  seller: string;

  @IsNotEmpty()
  lotId: string;

  @IsString()
  clientId: string;

  @IsString()
  projectId: string;

  // @IsNotEmpty()
  // saleId:string;

  // @IsString()
  // idLote: string;

  // @IsString()
  // idClient: string;

  // @IsString({ each: true })
  // @IsArray()
  // user: string[];

  // @IsString({ each: true })
  // @IsArray()
  // client: string[];

  // @IsObject() // Espera un objeto de Cliente
  //   client: Cliente;

  // @IsString({ each: true })
  // @IsArray()
  // lot: string[];

  // @IsObject() // Espera un objeto de Lote
  // lot: Lot;
}
