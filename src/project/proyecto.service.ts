import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { Repository } from 'typeorm';

@Injectable()

export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository:Repository<Proyecto>
  ){

  }
  async create(createProyectoDto: CreateProyectoDto) {
    const proyecto = this.proyectoRepository.create(createProyectoDto);
    await this.proyectoRepository.save(proyecto);
    // await proyecto.blocks;
    return proyecto;
  }

  findAll() {
    return this.proyectoRepository.find({relations:['blocks']});
  }

  findOne(id: number) {
    return `This action returns a #${id} proyecto`;
  }

  async update(id: string, updateProyectoDto: UpdateProyectoDto) {
    const proyecto = await this.proyectoRepository.preload({
      id:id,
      ...updateProyectoDto
    });
    if(!proyecto)
    throw new NotFoundException(`proyecto with id: ${id} not found` )
    await this.proyectoRepository.save(proyecto);

    return proyecto;
  }

  remove(id: number) {
    return `This action removes a #${id} proyecto`;
  }
}
