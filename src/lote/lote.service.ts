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

@Injectable()
export class LoteService {
  constructor(
    @InjectRepository(Lot)
    private readonly loteRespository: Repository<Lot>,
  ) {}
  async create(createLoteDto: CreateLoteDto) {
    try {
      const { ...lotDetails } = createLoteDto;
      const lote = this.loteRespository.create({
        ...lotDetails,
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
  findAll() {
    return this.loteRespository.find({});
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
