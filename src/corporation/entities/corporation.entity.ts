import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Corporation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  ruc: string;

  @Column('text')
  address: string;

  @Column('text')
  fullDescription: string;

  @Column('text')
  cellNumber: string;

  @Column('text')
  email: string;

  @Column('text')
  webSite: string;

  @Column('text')
  country: string;

  @Column('text')
  department: string;

  @Column('text')
  province: string;

  @Column('text')
  logo: string;

  @Column('text')
  manager: string;

  //   users
  
  @OneToMany(() => User, (user) => user.corporation, { cascade: false })
  user?: User[];
}
