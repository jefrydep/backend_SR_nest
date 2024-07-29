import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Block } from './entities/block.entity';
import { Repository } from 'typeorm';
import { Proyecto } from 'src/project/entities/proyecto.entity';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(Block)
    private readonly blockRepository: Repository<Block>,
    @InjectRepository(Proyecto)
    private readonly projectRepository: Repository<Proyecto>,
  ) {}

  async create(createBlockDto: CreateBlockDto): Promise<Block> {
    const project = await this.projectRepository.findOne({
      where: { id: createBlockDto.projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const block = this.blockRepository.create({
      ...createBlockDto,
      project,
    });

    await this.blockRepository.save(block);
    return block;
  }

  // findAll() {
  //   return this.blockRepository.find({relations:['lots','project']});
  // }
  // async findAll() {
  //   const block = await this.blockRepository
  //     .createQueryBuilder('block')
  //     // .leftJoinAndSelect('block.lots', 'lots')
  //     .leftJoin('block.project', 'project')
  //     .addSelect(['project.nameProject'])
  //     .getMany();

  //   return block.map((block) => ({
  //     ...block,
  //     project: block.project.nameProject,
  //   }));
  // }

  async findAll(projectId: string) {
    const blocks = await this.blockRepository
      .createQueryBuilder('block')
      .leftJoin('block.project', 'project')
      .addSelect(['project.nameProject'])
      .where('project.id = :projectId', { projectId })
      .getMany();

    return blocks.map((block) => ({
      ...block,
      project: block.project.nameProject,
    }));
  }
  findOne(id: number) {
    return `This action returns a #${id} block`;
  }

  update(id: number, updateBlockDto: UpdateBlockDto) {
    return `This action updates a #${id} block`;
  }

  remove(id: number) {
    return `This action removes a #${id} block`;
  }
}
