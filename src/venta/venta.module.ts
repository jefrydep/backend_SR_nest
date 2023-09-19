import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/venta.entity';
import { Lot } from 'src/lote/entities/lote.entity';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities/user.entity';

@Module({
  controllers: [VentaController],
  providers: [VentaService],
  imports: [TypeOrmModule.forFeature([Sale, Lot, Cliente, User]), AuthModule],
})
export class VentaModule {}
