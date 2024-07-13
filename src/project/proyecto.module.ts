import { Module } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { Block } from 'src/block/entities/block.entity';
import { Lot } from 'src/lot/entities/lote.entity';

@Module({
  controllers: [ProyectoController],
  providers: [ProyectoService],
  imports:[
    TypeOrmModule.forFeature([Proyecto,Block,Lot])
  ]
})
export class ProyectoModule {}
