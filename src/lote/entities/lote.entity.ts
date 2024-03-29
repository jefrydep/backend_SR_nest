import { IsOptional } from 'class-validator';
import { Sale } from 'src/venta/entities/venta.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Lot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  loteCode: string;


  @Column('text')
  loteState:string;


  @Column('text')
   aream2:string;

   @Column('decimal', { precision: 10, scale: 2 }) // Ejemplo de definición de columna para el importe (decimal con precisión y escala)
   price: number;

   @Column('decimal', { precision: 10, scale: 2 }) // Ejemplo de definición de columna para el importe (decimal con precisión y escala)
   cost: number;
  
   @Column('text')
   location:string;

   @Column('text')
   partidNumber:string

   
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
 
 
 
 
 
 
}
