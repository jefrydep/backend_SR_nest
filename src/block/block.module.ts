import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from './entities/block.entity';
@Module({
  controllers: [BlockController],
  providers: [BlockService],
  imports:[

    TypeOrmModule.forFeature([Block])
  ]
})
export class BlockModule {}
