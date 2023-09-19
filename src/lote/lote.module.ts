import { Module } from '@nestjs/common';
import { LoteService } from './lote.service';
import { LoteController } from './lote.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './entities/lote.entity';

@Module({
  controllers: [LoteController],
  providers: [LoteService],
  imports:[
    TypeOrmModule.forFeature([Lot])
  ]
})
export class LoteModule {}
