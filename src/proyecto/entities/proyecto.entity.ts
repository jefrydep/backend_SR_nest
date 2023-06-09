import { IsOptional } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Proyecto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  nameProject: string;

  @Column('text')
   location:string;

  // @Column('text')
  //  userId:string;

  @Column('text')
   aream2:string;

  @Column('text')
   abbrevation:string;

   

 
//   @Column('text', {
//     default: 'No tiene ruc',
//   })
//   ruc?: string;
 
 
 
 
 
 
}
