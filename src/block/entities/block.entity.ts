import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  block: string;

  @Column('text')
  aream2: string;

  @Column('text')
  description: string;
}
