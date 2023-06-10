import { IsOptional } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string;

  @Column('text')
  age: string;

  @Column('text',{
    unique:true
  })
  dni: string;

  // @Column('text', {
  //   default: 'No tiene ruc',
  // })
  // ruc?: string;

  @Column('text', {
    default: 'Sin Numero',
  })
  cellNumber?: string;

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

  @Column('text')
  country:string

  @ManyToOne(
    ()=>User,
    (user)=> user.client
  )
  user:User
  // @Column('text')
  // idLote:string;

  // @Column('text')
  // iduser:string;
}
