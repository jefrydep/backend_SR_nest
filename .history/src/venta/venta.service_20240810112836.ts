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
        where: { id: createVentaDto.lotId },
      });

      if (!lot) {
        throw new NotFoundException('Lot not found');
      }

      if (lot.sale) {
        throw new Error('Lot has already been sold');
      }

      const client = await this.clientRespository.findOne({
        where: { id: createVentaDto.clientId },
      });

      if (!client) {
        throw new NotFoundException('Client not found');
      }

      let remainingAmount: number | undefined;
      let monthlyPayments: { amount: number; dueDate: Date }[] | undefined;

      // Realizar cálculos solo si amount, initial e installmentsNumber están presentes
      if (
        createVentaDto.amount !== undefined &&
        createVentaDto.initial !== undefined &&
        createVentaDto.installmentsNumber !== undefined
      ) {
        remainingAmount = createVentaDto.amount - createVentaDto.initial;
        const monthlyFee = remainingAmount / createVentaDto.installmentsNumber;


      // Convertir saleDate de string a Date
      const saleDate = new Date(createVentaDto.saleDate);
        // Generar cuotas mensuales
        monthlyPayments = Array.from({
          length: createVentaDto.installmentsNumber,
        }).map((_, index) => {
          const dueDate = new Date(saleDate); // Copia de saleDate
          dueDate.setMonth(dueDate.getMonth() + index + 1); // Incrementar el mes para cada cuota
          return {
            amount: monthlyFee,
            dueDate,
          };
        });
      }

      const sale = this.ventaRepository.create({
        ...createVentaDto,

        client,
        lot,
        project,
        // projectId: createVentaDto.projectId,
        remainingAmount, // Solo se guardará si fue calculado
        monthlyPayments, // Array de cuotas mensuales generadas
      });

      await this.ventaRepository.save(sale);
      return sale;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  // async create(createVentaDto: CreateVentaDto): Promise<Sale> {
  //   try {
  //     const project = await this.projectRepository.findOne({
  //       where: { id: createVentaDto.projectId },
  //     });

  //     if (
  //       createVentaDto.initial &
  //       createVentaDto.installmentsNumber &
  //       createVentaDto.amount
  //     ) {
  //       const remainingAmount = createVentaDto.amount - createVentaDto.initial;
  //       const montlyFee = remainingAmount / createVentaDto.installmentsNumber;

  //     }
  //     if (!project) {
  //       throw new NotFoundException('Project not found');
  //     }
  //     const lot = await this.lotRespository.findOne({
  //       where: {
  //         id: createVentaDto.lotId,
  //       },
  //     });
  //     if (!lot) {
  //       throw new NotFoundException('Lot not found');
  //     }

  //     if (lot.sale) {
  //       throw new Error('Lot has already been sold');
  //     }
  //     const client = await this.clientRespository.findOne({
  //       where: {
  //         id: createVentaDto.clientId,
  //       },
  //     });

  //     if (!client) {
  //       throw new NotFoundException('Client not found');
  //     }
  //     // const user = await this.userRepository.findOne({
  //     //   where: { id: createVentaDto.userId },
  //     // });
  //     // if (!user) {
  //     //   throw new NotFoundException('User not found');
  //     // }
  //     const sale = this.ventaRepository.create({
  //       ...createVentaDto,
  //       client,
  //       lot,
  //       project,
  //       remainingAmount:r
  //     });

  //     await this.ventaRepository.save(sale);
  //     return sale;

  //     // return savedSale;
  //   } catch (error) {
  //     this.handleDbErrors(error);
  //   }
  // }

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
      id: id,
      ...updateVentaDto,
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
