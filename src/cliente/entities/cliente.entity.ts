import { IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string;

  @Column('text')
  age: string;

  @Column('text')
  dni: string;

  @Column('text', {
    default: 'No tiene ruc',
  })
  ruc?: string;

  @Column('text', {
    default: 'Sin Numero',
  })
  cellPhone?: string;

  @Column('text')
  gender: string;

  @Column('text',{
    default:"Desconose"
  })
  address?: string;

  @Column('text')
  department: string;

  @Column('text')
  province: string;

  @Column('text')
  distrit: string;

  // @Column('text')
  // idLote:string;

  // @Column('text')
  // iduser:string;
}
