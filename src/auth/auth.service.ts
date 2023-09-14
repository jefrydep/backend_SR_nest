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
    const user = await this.userRepository.findOneBy({ id });

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

  async generarPdf(): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise((resolve) => {
      const doc = new PDFDocument({
        size:"LETTER",
        bufferPages:true
      });
      doc.text("pdg generado dese nuesto bakend")


      const buffer = []
      doc.on("data",buffer.push.bind(buffer))
      doc.on("end",()=>{
        const data = Buffer.concat(buffer)
        resolve(data)
      })
      doc.end();
    });
    return pdfBuffer;
  }
}
