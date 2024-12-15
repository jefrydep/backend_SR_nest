import { Module } from '@nestjs/common';
import { LoteService } from './lote.service';
import { LoteController } from './lote.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './entities/lote.entity';
import { Block } from 'src/block/entities/block.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [LoteController],
  providers: [LoteService],
  imports:[
    TypeOrmModule.forFeature([Lot,Block]),
    AuthModule
  ]
})
export class LoteModule {}
