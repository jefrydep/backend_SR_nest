import { IsOptional } from 'class-validator';
import { User } from 'src/auth/entities/user.entity';
import { Sale } from 'src/venta/entities/venta.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('')
export class Cliente {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string;

  @Column('text')
  birthdayDate: string;

  @Column('text', {
    unique: true,
  })
  dni: string;

  @Column('text', {
    default: '',
  })
  ruc?: string;
  @Column('text', {
    default: '',
  })
  email?: string;

  @Column('text')
  maritalStatus: string;

  @Column('text', {
    default: 'Sin Numero',
  })
  cellNumber?: string;

  @Column('text')
  gender: string;

  @Column('text', {
    default: 'Desconose',
  })
  address?: string;

  @Column('text')
  department: string;

  @Column('text')
  province: string;

  @Column('text')
  distrit: string;

  @Column('text')
  country: string;

  @Column('text', {
    default: '',
  })
  beneficiary?: string;

  @Column('text', {
    default: '',
  })
  observations?: string;

  @Column('text', {
    default: '',
  })
  nameSpouse?: string;

  @Column('text', {
    default: '',
  })
  dniSpouse?: string;

  @Column('text', {
    default: '',
  })
  genderSpouse?: string;

  @Column('text', {
    default: '',
  })
  cellNumberSpouse?: string;

  @Column('text', {
    default: '',
  })
  emailSpouse?: string;

  @Column('text', {
    default: '',
  })
  birthdayDateSpouse: string;

  @ManyToOne(
    () => User,
    (user) => user.clients,
    { eager: true }, // esto es para que cargue atuomaticamnte la relacion de usuario cliente
  )
  user: User;

  @OneToMany(() => Sale, (sale) => sale.client)
  sale?: Sale[];

  // @OneToMany(() => Sale)
  // sales: Sale[];

  // @Column('text')
  // idLote:string;

  // @Column('text')
  // iduser:string;
}
