import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from './entities/block.entity';
import { Proyecto } from 'src/project/entities/proyecto.entity';
@Module({
  controllers: [BlockController],
  providers: [BlockService],
  imports:[

    TypeOrmModule.forFeature([Block,Proyecto])
  ]
})
export class BlockModule {}
