import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto) {
    try {
      const cliente = this.clienteRepository.create(createClienteDto);

      await this.clienteRepository.save(cliente);

      return cliente;
    } catch (error) {
      throw new InternalServerErrorException('ayuda');
    }
  }

  findAll() {
    return this.clienteRepository.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} cliente`;
  }

  async update(id: string, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.clienteRepository.preload({
      id: id,
      ...updateClienteDto,
    });
    if (!cliente)
      throw new NotFoundException(`Client with id: ${id} not found`);
    await this.clienteRepository.save(cliente);

    return cliente;
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
  }
}
