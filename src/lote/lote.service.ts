import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lote } from './entities/lote.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LoteService {
  
  constructor(

    @InjectRepository(Lote)
    private readonly loteRespository:Repository<Lote>
  ){
  }
  async create(createLoteDto: CreateLoteDto) {
   try {
    const lote = this.loteRespository.create(createLoteDto);
    await this.loteRespository.save(lote);

    return lote;
   } catch (error) {
    
   }
  }

  findAll() {
    return this.loteRespository.find({})
  }

  findOne(id: number) {
    return `This action returns a #${id} lote`;
  }

  async update(id: string, updateLoteDto: UpdateLoteDto) {
    const lote  = await this.loteRespository.preload({
      id:id,
      ...updateLoteDto,
    });
    if(!lote)
    throw new NotFoundException(`lote with id : ${id} not found`)
    await this.loteRespository.save(lote);
    return lote;
   
  }

  remove(id: number) {
    return `This action removes a #${id} lote`;
  }
}
