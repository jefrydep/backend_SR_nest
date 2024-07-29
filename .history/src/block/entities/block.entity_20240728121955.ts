import { IsOptional } from 'class-validator';
import { Lot } from 'src/lot/entities/lote.entity';
import { Proyecto } from 'src/project/entities/proyecto.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  block: string;

  // @IsOptional()
  // @Column('text')
  // aream2?: string;
  
  @Column('text',{
    default:"",
  })
  description?: string;
  
  @ManyToOne(() => Proyecto, (project) => project.blocks)
  project: Proyecto;

  @OneToMany(()=> Lot,(lot)=> lot.block,{cascade:true})
  lots?:Lot[]

   

}
