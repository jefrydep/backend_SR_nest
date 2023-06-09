import { Injectable, NotFoundException } from '@nestjs/common';
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

  async update(id: string, updateVentaDto: UpdateVentaDto) {

    const venta  = await this.ventaRepository.preload({
      id:id,
      ...updateVentaDto
    });
    if(!venta)
    throw new NotFoundException(`Venta with id : ${id} not found`)
    await this.ventaRepository.save(venta);
    return venta;
     
  }

  remove(id: number) {
    return `This action removes a #${id} venta`;
  }
}
