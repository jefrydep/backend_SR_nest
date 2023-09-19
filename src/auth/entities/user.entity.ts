import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Sale } from 'src/venta/entities/venta.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  documentNumber: string;

  @Column('text')
  address: string;
  
  @Column('text')
  phoneNumber: string;

  @Column('text')
  email: string;

  @Column('text', {
    select: true,
  })
  password: string;

  @Column('text')
  name: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  role: string[];

  @OneToMany(
    ()=> Cliente,
    (client) => client.user,
    {cascade:true}
  )
  clients?: Cliente[];

  // @OneToMany(
  //   ()=> Sale,
  //   (sale)=> sale.user,
  //   {cascade:true}

  // )
  // sales?:Sale[]


  
  //   @Column('time', {})
  //   createdAt: Date;

  // @Column('time')
  // updatedAt:Date;
}
