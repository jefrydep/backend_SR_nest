import { Injectable } from '@nestjs/common';
import { CreateCorporationDto } from './dto/create-corporation.dto';
import { UpdateCorporationDto } from './dto/update-corporation.dto';
import { Corporation } from './entities/corporation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CorporationService {
  constructor(
    @InjectRepository(Corporation)
    private readonly corporationRepository: Repository<Corporation>,
  ) {}
  async create(createCorporationDto: CreateCorporationDto) {
    try {
      const corporation =
        this.corporationRepository.create(createCorporationDto);
      await this.corporationRepository.save(corporation);
      return corporation;
    } catch (error) {
      console.log(error)
    }

    
  }

  findAll() {
    return `This action returns all corporation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} corporation`;
  }

  update(id: number, updateCorporationDto: UpdateCorporationDto) {
    return `This action updates a #${id} corporation`;
  }

  remove(id: number) {
    return `This action removes a #${id} corporation`;
  }
}
