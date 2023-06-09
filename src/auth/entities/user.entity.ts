import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  documentNumber: string;

  @Column('text',{
    select:true
  })
  password: string;

  @Column('text')
  name: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  role: string[];

  @OneToMany(
    ()=> Cliente,
    (client) => client.user,
    {cascade:true}
  )
  clients?: Cliente [];


//   @Column('time', {})
//   createdAt: Date;

  // @Column('time')
  // updatedAt:Date;
}
