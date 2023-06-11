import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto, user: User) {
    try {
      const { ...clienteDetails } = createClienteDto;
      const cliente = this.clienteRepository.create({
        ...clienteDetails,
        user,
      });

      await this.clienteRepository.save(cliente);

      return cliente;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 0, offset = 0 } = paginationDto;
    return this.clienteRepository.find({
      take: limit,
      skip: offset,
      //TODO: RELACIONES
    });
  }

  async findOne(id: string) {
    const cliente = await this.clienteRepository.findOneBy({ id });
    if (!cliente) throw new NotFoundException(`Client with ${id} not found`);
    return cliente;
  }
  private handleDbErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('please check server logs');
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

  async remove(id: string) {
    const client = await this.findOne(id);
    await this.clienteRepository.remove(client);
  }
}
