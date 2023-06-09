import { Injectable } from '@nestjs/common';
import { CreateManzanaDto } from './dto/create-manzana.dto';
import { UpdateManzanaDto } from './dto/update-manzana.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Manzana } from './entities/manzana.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ManzanaService {
  constructor(
    @InjectRepository(Manzana)
    private readonly manzanaRepositorry:Repository<Manzana>
  ){

  }
  async create(createManzanaDto: CreateManzanaDto) {
    const manzana = this.manzanaRepositorry.create(createManzanaDto)
    await this.manzanaRepositorry.save(manzana);


    return manzana;

  }

  findAll() {
    return this.manzanaRepositorry.find({})
  }

  findOne(id: number) {
    return `This action returns a #${id} manzana`;
  }

  async update(id: string, updateManzanaDto: UpdateManzanaDto) {
    const manzana = await this.manzanaRepositorry.preload({
      id:id,
      ...updateManzanaDto
    })
  }

  remove(id: number) {
    return `This action removes a #${id} manzana`;
  }
}
