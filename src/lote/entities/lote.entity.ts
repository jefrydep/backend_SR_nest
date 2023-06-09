import { IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Lote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  loteCode: string;


  @Column('text')
  loteState:string;


  @Column('text')
   aream2:string;

   @Column('text')
   price:string;

   @Column('text')
   location:string;

   @Column('text')
   partidNumber?:string

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
