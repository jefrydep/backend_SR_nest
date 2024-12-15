import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Block } from './entities/block.entity';
import { Proyecto } from 'src/project/entities/proyecto.entity';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  controllers: [BlockController],
  providers: [BlockService],
  imports: [TypeOrmModule.forFeature([Block, Proyecto]), AuthModule],
})
export class BlockModule {}
