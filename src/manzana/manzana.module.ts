import { Module } from '@nestjs/common';
import { ManzanaService } from './manzana.service';
import { ManzanaController } from './manzana.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manzana } from './entities/manzana.entity';

@Module({
  controllers: [ManzanaController],
  providers: [ManzanaService],
  imports:[
    TypeOrmModule.forFeature([Manzana])
  ]
})
export class ManzanaModule {}
