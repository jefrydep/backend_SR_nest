import { Injectable } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Venta } from './entities/venta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VentaService {

  constructor(
@InjectRepository(Venta)
private readonly ventaRepository:Repository<Venta>

  ) {

  }
 async create(createVentaDto: CreateVentaDto) {
    const venta = this.ventaRepository.create(createVentaDto);
    await this.ventaRepository.save(venta);

    return venta; 
  }

  findAll() {
    return  this.ventaRepository.find({})
  }

  findOne(id: number) {
    return `This action returns a #${id} venta`;
  }

  update(id: number, updateVentaDto: UpdateVentaDto) {
    return `This action updates a #${id} venta`;
  }

  remove(id: number) {
    return `This action removes a #${id} venta`;
  }
}
