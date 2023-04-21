import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository:Repository<Cliente>
  ){}

  async create(createClienteDto: CreateClienteDto) {
try {
  const cliente = this.clienteRepository.create(createClienteDto);

  await this.clienteRepository.save(cliente);

  return cliente;
  
} catch (error) {
    throw new InternalServerErrorException('ayuda')
}
}

    
 

  findAll() {
    return `This action returns all cliente`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cliente`;
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} cliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
  }
}
