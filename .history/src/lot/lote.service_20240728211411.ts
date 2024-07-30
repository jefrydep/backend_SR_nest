import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lot } from './entities/lote.entity';
import { Repository } from 'typeorm';
import { Block } from 'src/block/entities/block.entity';

@Injectable()
export class LoteService {
  constructor(
    @InjectRepository(Lot)
    private readonly loteRespository: Repository<Lot>,
    @InjectRepository(Block)
    private readonly blockRespository: Repository<Block>,
  ) {}
  async create(createLoteDto: CreateLoteDto) {
    try {
      const { ...lotDetails } = createLoteDto;
      const block = await this.blockRespository.findOne({
        where: {
          id: createLoteDto.blockId,
        },
      });
      if (!block) {
        throw new NotFoundException('Block not found');
      }

      const lote = this.loteRespository.create({
        ...lotDetails,
        block,
      });
      await this.loteRespository.save(lote);

      return lote;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }
  private handleDbErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('please check server logs');
  }

  // async findAll() {
  //   return await this.loteRespository.find({relations:["block"]});
  // }
  async findAll(projectId: string) {
    const lots = await this.loteRespository
      .createQueryBuilder('lot')
      .leftJoin('lot.block', 'block')
      // .addSelect('block.block', 'block')
      .addSelect(['block.block'])
      .where('block.projectId = :projectId', { projectId })

      .getMany();
    return lots;
    // return this.loteRespository.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} lote`;
  }

  async update(id: string, updateLoteDto: UpdateLoteDto) {
    const lote = await this.loteRespository.preload({
      id: id,
      ...updateLoteDto,
    });
    if (!lote) throw new NotFoundException(`lote with id : ${id} not found`);
    await this.loteRespository.save(lote);
    return lote;
  }

  remove(id: number) {
    return `This action removes a #${id} lote`;
  }
}
