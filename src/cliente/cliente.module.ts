import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Sale } from 'src/venta/entities/venta.entity';

@Module({
  controllers: [ClienteController],
  providers: [ClienteService],
  imports:[
    TypeOrmModule.forFeature([Cliente,Sale]),
    AuthModule
  ]
})
export class ClienteModule {}
