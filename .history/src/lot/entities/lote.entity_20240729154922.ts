import { IsOptional } from 'class-validator';
import { Block } from 'src/block/entities/block.entity';
import { Sale } from 'src/venta/entities/venta.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class Lot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  loteCode: string;

  @Column('text')
  loteState: string;

  @Column('text')
  aream2: string;

  @Column('decimal', { precision: 10, scale: 2 }) // Ejemplo de definición de columna para el importe (decimal con precisión y escala)
  price: number;

  @Column('decimal', { precision: 10, scale: 2 }) // Ejemplo de definición de columna para el importe (decimal con precisión y escala)
  cost: number;

  @Column('text')
  frontSide: string;

  @Column('text')
  leftSide: string;

  @Column('text')
  rightSide: string;

  @Column('text')
  depthSide: string;

  @Column('text')
  partidNumber?: string;

  @ManyToOne(() => Block, (block) => block.lots)
  block: Block;

  @OneToOne(() => Sale, (sale) => sale.lot)
  sale: Sale;
  //  @OneToOne(() => Sale, sale => sale.lot)
  //  sale: Sale;

  //  @OneToOne()
  // @Column('text')
  //  userId:string;

  // @Column('text')
  //  manzanaId:string;

  // @Column('text')
  //  proyectoId:string;

  //   @Column('text', {
  //     default: 'No tiene ruc',
  //   })
  //   ruc?: string;

  @Column({ default: false }) // Campo para indicar si el lote está vendido o no, con valor predeterminado de false
  isSold: boolean;
}
