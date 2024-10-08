import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Lot } from 'src/lot/entities/lote.entity';
import { Proyecto } from 'src/project/entities/proyecto.entity';
import { IsString } from 'class-validator';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  saleType: string;

  @Column('date')
  saleDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column('text')
  obserbations: string;

  @Column('int', { default: 0 })
  installmentsNumber?: number;

  @Column('text')
  bankName: string;

  @Column('text')
  receipt: string;

  @Column('text')
  numberReceipt: string;

  @Column('text')
  paymentMethod: string;

  @Column('text')
  operationCode: string;

  @Column('text')
  voucherImg: string;

  @Column({ nullable: true })
  firstInstallmentDate?: Date;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  initial?: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  remainingAmount?: number;

  @Column('text')
  seller: string;

  // @ManyToOne(
  //   () => User,
  //   (user) => user.clients,
  //   { eager: true }, // esto es para que cargue atuomaticamnte la relacion de usuario cliente
  // )
  // user: User;
  @ManyToOne(() => Cliente, (client) => client.sale)
  client: Cliente;

  @ManyToOne(() => Proyecto, (project) => project.sales)
  project: Proyecto;

  @OneToOne(() => Lot, (lot) => lot.sale)
  @JoinColumn()
  lot: Lot;
  // @Column('text')
  // idLote: string;

  // @Column('text')
  // idClient: string;

  // @ManyToOne(() => User, (user) => user.sales, { eager: true,  })
  // user: User;

  // @ManyToOne(() => Cliente, (client) => client.sales, {
  //   eager: true,
  //   nullable: false,
  // })
  // @JoinColumn()
  // client: Cliente;
  // @ManyToOne(() => Cliente, { eager: true }) // Relación con Cliente
  // @JoinColumn({ name: 'cliente_id' }) // Nombre de la columna en la tabla
  // cliente: Cliente;

  // @OneToOne(() => Lot, (lot) => lot.sale, {  })
  // @JoinColumn()
  // lot: Lot;

  // @OneToOne(() => Lot, { eager: true })
  // @JoinColumn()
  // lote: Lot;
}
