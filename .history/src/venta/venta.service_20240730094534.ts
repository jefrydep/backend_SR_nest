import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sale } from './entities/venta.entity';
import { Repository } from 'typeorm';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { Lot } from 'src/lot/entities/lote.entity';
import { User } from 'src/auth/entities/user.entity';
import { CreateClienteDto } from 'src/cliente/dto/create-cliente.dto';
import { Proyecto } from 'src/project/entities/proyecto.entity';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Sale)
    private readonly ventaRepository: Repository<Sale>,
    @InjectRepository(Cliente)
    private readonly clientRespository: Repository<Cliente>,

    @InjectRepository(Proyecto)
    private readonly projectRepository: Repository<Proyecto>,

    @InjectRepository(Lot)
    private readonly lotRespository: Repository<Lot>,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Sale> {
    try {
      const project = await this.projectRepository.findOne({
        where: { id: createVentaDto.projectId },
      });
      if (!project) {
        throw new NotFoundException('Project not found');
      }
      const lot = await this.lotRespository.findOne({
        where: {
          id: createVentaDto.lotId,
        },
      });
      if (!lot) {
        throw new NotFoundException('Lot not found');
      }

      if (lot.sale) {
        throw new Error('Lot has already been sold');
      }
      const client = await this.clientRespository.findOne({
        where: {
          id: createVentaDto.clientId,
        },
      });

      if (!client) {
        throw new NotFoundException('Client not found');
      }
      // const user = await this.userRepository.findOne({
      //   where: { id: createVentaDto.userId },
      // });
      // if (!user) {
      //   throw new NotFoundException('User not found');
      // }
      const sale = this.ventaRepository.create({
        ...createVentaDto,
        client,
        lot,
        project,
      });

      await this.ventaRepository.save(sale);
      return sale;

      // return savedSale;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  // findAll() {
  //   return this.ventaRepository.find({});
  // }

  async findAll(projectId: string) {
    const sales = await this.ventaRepository
      .createQueryBuilder('sale')
      .leftJoin('sale.project', 'project')
      .addSelect(['project.nameProject'])
      .where('project.id = :projectId', { projectId })
      .getMany();

    return sales.map((sale) => ({
      ...sale,
      project: sale.project.nameProject,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} venta`;
  }

  async update(id: string, updateVentaDto: UpdateVentaDto) {
    const venta = await this.ventaRepository.preload({
      // id:id,
      // ...updateVentaDto,
    });
    if (!venta) throw new NotFoundException(`Venta with id : ${id} not found`);
    await this.ventaRepository.save(venta);
    return venta;
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('please check server logs');
  }
  remove(id: number) {
    return `This action removes a #${id} venta`;
  }
}
