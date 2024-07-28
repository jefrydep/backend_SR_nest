import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Proyecto } from './entities/proyecto.entity';
import { Repository } from 'typeorm';
import { Lot } from 'src/lot/entities/lote.entity';
import { Block } from 'src/block/entities/block.entity';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectRepository(Proyecto)
    private readonly proyectoRepository: Repository<Proyecto>,

    @InjectRepository(Lot)
    private readonly lotRepository: Repository<Lot>,
    @InjectRepository(Block)
    private readonly blockRepository: Repository<Block>,
  ) {}
  async create(createProyectoDto: CreateProyectoDto) {
    const proyecto = this.proyectoRepository.create(createProyectoDto);
    await this.proyectoRepository.save(proyecto);
    // await proyecto.blocks;
    return proyecto;
  }
  async findOne(id: string) {
    const project = await this.proyectoRepository.findOneBy({ id });
    if (!project) throw new NotFoundException(`Project with ${id} not found`);
    return project;
  }
  async findAll() {
    const projects = await this.proyectoRepository.find({
      relations: ['blocks', 'blocks.lots'],
    });
  
    return projects.map(project => {
      const totalLots = project.blocks.reduce((sum, block) => sum + block.lots.length, 0);
      const soldLots = project.blocks.reduce((sum, block) => 
        sum + block.lots.filter(lot => lot.isSold !== false).length, 0
      );
      const availableLots = totalLots - soldLots;
  
      // Retornar el proyecto sin la propiedad blocks
      const { blocks, ...projectWithoutBlocks } = project;
  
      return {
        ...projectWithoutBlocks,
        totalLots,
        soldLots,
        availableLots,
      };
    });
  }

   

  async update(id: string, updateProyectoDto: UpdateProyectoDto) {
    const proyecto = await this.proyectoRepository.preload({
      id: id,
      ...updateProyectoDto,
    });
    if (!proyecto)
      throw new NotFoundException(`proyecto with id: ${id} not found`);
    await this.proyectoRepository.save(proyecto);

    return proyecto;
  }

 
  async remove(id: string) {
    const project = await this.findOne(id);
    await this.proyectoRepository.remove(project);
  }
}
