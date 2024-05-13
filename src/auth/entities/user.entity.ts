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
  

  @Column('text')
  lastName: string;

  @Column('text')
  idCorporation: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  role: string[];

  
  @Column({ nullable: true }) // Permite valores nulos
  deleted_at: Date; // Fecha y hora en que se marca como eliminado


  @OneToMany(() => Cliente, (client) => client.user, { cascade: false })
  clients?: Cliente[];

  @OneToMany(() => Sale, (sale) => sale.user, { cascade: false })
  sale?: Sale[];

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
