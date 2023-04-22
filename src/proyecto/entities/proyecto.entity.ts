import { IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Proyecto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  LoteCode: string;

  @Column('text')
   areaM2:string;

  @Column('text')
   userId:string;

  @Column('text')
   manzanaId:string;

  @Column('text')
   proyectoId:string;

   

 
//   @Column('text', {
//     default: 'No tiene ruc',
//   })
//   ruc?: string;
 
 
 
 
 
 
}
