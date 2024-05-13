import { Module } from '@nestjs/common';
import { CorporationService } from './corporation.service';
import { CorporationController } from './corporation.controller';
import { Corporation } from './entities/corporation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CorporationController],
  providers: [CorporationService],
  imports:[
    TypeOrmModule.forFeature([Corporation])
  ]

})
export class CorporationModule {}
