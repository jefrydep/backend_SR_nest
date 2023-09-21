import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { UpdateClienteDto } from 'src/cliente/dto/update-cliente.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Cliente } from 'src/cliente/entities/cliente.entity';
import { resolve } from 'path';
const PDFDocument = require('pdfkit-table');

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,

        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      // momentaniamente elimanos la contraseña porque no queremos mostrarlo
      // delete user.password;
      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, documentNumber } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { documentNumber },
      select: {
        address: true,
        email: true,
        phoneNumber: true,
        documentNumber: true,
        password: true,
        id: true,
        name: true,
        role: true,
      },
     
    });
    if (!user)
      throw new UnauthorizedException(
        'Credentials are not valid (documentNumber)',
      );

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid(password)');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };

    //TODO: retornar el jwt
  }
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
  private handleDbErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('please check server logs');
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 0, offset = 0 } = paginationDto;
    return this.userRepository.find({
      take: limit,
      skip: offset,
      //TODO: RELACIONES
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where:{
        id,
         
      },
      relations:["clients","sale"]
      
    });

    if (!user) throw new NotFoundException(`user with ${id} not found`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...userData } = updateUserDto;
    const user = await this.userRepository.preload({
      id: id,
      ...userData,
      password: bcrypt.hashSync(password, 10),
    });
    await this.userRepository.save(user);
    console.log(user);

    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

async findOneWithClients(id: string) {
  const user = await this.userRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.clients", "clients")
    .where("user.id = :id", { id })
    .getOne();

  if (!user) {
    throw new NotFoundException(`User with ID ${id} not found`);
  }

  return user;
}
  async generarPdf(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise(async (resolvePromise) => {
      const doc = new PDFDocument({
        size: 'LETTER',
      });
      //encabezado de pagin

      // Encabezado de página (JefryDeveloper)
      doc.registerFont('Helvetica-Bold', 'Helvetica-Bold');
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .text('JefryDeveloper', 50, 10, { align: 'left' });

      // Encabezado
      doc.fontSize(16).text('Lista de Usuarios', { align: 'center' });
      doc.moveDown(); // Espacio después del título

      // Crear la tabla de usuarios
      // this.userRepository
      // .find()
      // .then((users) => {
      //   const usersData = [
      //     ['Nombre', 'Apellido', 'Peso', 'Talla'],
      //     // Aquí puedes rellenar los datos de los usuarios
      //     // Usar los datos de los usuarios que obtuviste de la base de datos
      //     ...users.map((user) => [
      //       user.name,
      //       user.documentNumber,
      //       user.email,
      //       user.phoneNumber,
      //       user.address,
      //       user.sale.length

      //     ]),
      //   ];
      const users =   await this.userRepository.find()      // const usersData = [
      //   ['Nombre', 'Apellido', 'Peso', 'Talla'],
      //   // Aquí puedes rellenar los datos de los usuarios
      //   ['Usuario 1', 'Apellido 1', '70 kg', '175 cm'],
      //   ['Usuario 2', 'Apellido 2', '65 kg', '170 cm'],
      //   // Agrega datos para los otros usuarios aquí
      // ];
      const usersData =  [
        ['Nombre', 'Apellido', 'Peso', 'Talla'],
        // Aquí puedes rellenar los datos de los usuarios
        ...users.map((user) => [
          user.name,
         
        ]),
      ];
      doc.table({
        headers: usersData[0],
        rows: usersData.slice(1),
        width: { min: 50, max: 150 },
        align: ['left', 'left', 'left', 'left'],
        padding: 5,
        margin: { top: 15 },
      });
       
   
      for (let i = 1; i <= 3; i++) {
        doc.addPage();
        doc.fontSize(16).text(`Página ${i + 1}`, { align: 'center' });
        doc.moveDown(); // Espacio después del título de la página

        // Aquí puedes agregar contenido adicional en cada página adicional
      }
      const buffer = [];
      doc.on('data', (data) => buffer.push(data));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolvePromise(data);
      });

      doc.end();
    });
    return pdfBuffer;
  }
}
