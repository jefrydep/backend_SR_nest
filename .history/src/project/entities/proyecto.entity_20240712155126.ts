import { IsOptional } from 'class-validator';
import { Block } from 'src/block/entities/block.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Proyecto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  nameProject: string;

  @Column('text')
  location: string;

  // @Column('text')
  //  userId:string;

  @Column('text')
  aream2: string;

  @Column('text')
  description: string;

  // @Column('text')
  // abbrevation: string;

  // @Column('text')
  // address: string;

  @Column('text')
  status: string;

  @OneToMany(() => Block, (block) => block.project, { cascade: true })
  blocks?: Block[];

  //   @Column('text', {
  //     default: 'No tiene ruc',
  //   })
  //   ruc?: string;
}
