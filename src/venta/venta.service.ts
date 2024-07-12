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

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Sale)
    private readonly ventaRepository: Repository<Sale>,
    @InjectRepository(Cliente)
    private readonly clientRespository: Repository<Cliente>,
    @InjectRepository(Lot)
    private readonly lotRespository: Repository<Lot>,
  ) {}
  async create(id: string, createVentaDto: CreateVentaDto, user: User) {
    try {
      const { clientId, ...saleDetails } = createVentaDto;
      // const lote = await this.lotRespository.findOneBy({ id: lot });
      const clientFound = await this.clientRespository.findOneBy({id:clientId});

      // if (!lote) {
      //   throw new NotFoundException(`Lote with ID ${idLote} not found`);
      // }

      const lotfound = await this.lotRespository.findOne({
        where: { id: id },
      });
      // const clientFound = await this.lotRespository.findOne({
      //   where: { id: idClient },
      // });
      if (!lotfound) {
        return new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
      // Crea la venta con las relaciones client y lot
      // const clientfoun = await this.clientRespository.findOneBy({ id: client });
      // const lotFound = await this.lotRespository.findOneBy({ id: lot });
      const newSale = this.ventaRepository.create({
        ...saleDetails,
        lote: lotfound,
        user,
        client: clientFound,

        // Asigna el lote encontrado a la venta
      });

      const savedSale = await this.ventaRepository.save(newSale);

      return savedSale;
      // return savedSale;
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  findAll() {
    return this.ventaRepository.find({});
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
