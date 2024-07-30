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

// import * as fs from 'fs';
// import * as path from 'path';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PDFDocument = require('pdfkit-table');

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class ClienteService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto,  ) {
    try {
      const { ...clienteDetails } = createClienteDto;

      const cliente = this.clienteRepository.create({
        ...clienteDetails,
      
      });

      await this.clienteRepository.save(cliente);

      return {
        ...cliente,
      };
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
      // relations:[use]
    });
  }
  // async findAll(projectId:string){
  //   const client = await this.clienteRepository
  //   .createQueryBuilder('client')
  //   .innerJoin('client.lot','lot')

  // }

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
  // async generarPdf(): Promise<Buffer> {
  //   // aqui buscamos nuestros clientes
  //   const clients = await this.clienteRepository.find();
  //   const pdfBuffer: Buffer = await new Promise((resolvePromise) => {
  //     const doc = new PDFDocument({
  //       size: 'LETTER',
  //     });
  //     //encabezado de pagin

  //     // Encabezado de página (JefryDeveloper)
  //     doc.registerFont('Helvetica-Bold', 'Helvetica-Bold');
  //     doc
  //       .font('Helvetica-Bold')
  //       .fontSize(10)
  //       .text('JefryDeveloper', 50, 10, { align: 'left' });

  //     // Encabezado
  //     doc.fontSize(16).text('Lista de Usuarios', { align: 'center' });
  //     doc.moveDown(); // Espacio después del título

  //     // Crear la tabla de usuarios
  //     const usersData = [
  //       ['Nombre', 'Apellido', 'Peso', 'Talla'],
  //       // Aquí puedes rellenar los datos de los usuarios
  //       ['Usuario 1', 'Apellido 1', '70 kg', '175 cm'],
  //       ['Usuario 2', 'Apellido 2', '65 kg', '170 cm'],
  //       // Agrega datos para los otros usuarios aquí
  //     ];

  //     doc.table({
  //       headers: usersData[0],
  //       rows: usersData.slice(1),
  //       width: { min: 50, max: 150 },
  //       align: ['left', 'left', 'left', 'left'],
  //       padding: 5,
  //       margin: { top: 15 },
  //     });

  //     const rowClients = [];
  //     clients.forEach((element) => {
  //       const tem_Lis = [
  //         element.fullName,
  //         element.dni,
  //         element.department,
  //         element.cellNumber,
  //         element.address,
  //       ];
  //       rowClients.push(tem_Lis);
  //     });
  //     doc.table({

  //       headers:["Nombre Completo","Dni","Departamento","N° Celular","Direccon"],
  //       rows:  rowClients,
  //       width: { min: 50, max: 150 },
  //       align: ['left', 'left', 'left', 'left'],
  //       padding: 5,
  //       margin: { top: 15 },
  //     });

  //     // Agrega más páginas aquí
  //     for (let i = 1; i <= 3; i++) {
  //       doc.addPage();
  //       doc.fontSize(16).text(`Página ${i + 1}`, { align: 'center' });
  //       doc.moveDown(); // Espacio después del título de la página

  //       // Aquí puedes agregar contenido adicional en cada página adicional
  //     }
  //     const buffer = [];
  //     doc.on('data', (data) => buffer.push(data));
  //     doc.on('end', () => {
  //       const data = Buffer.concat(buffer);
  //       resolvePromise(data);
  //     });

  //     doc.end();
  //   });
  //   return pdfBuffer;
  // }
  async generarPdfClientes(): Promise<Buffer> {
    const clientes = await this.clienteRepository.find();

    const tableBody = clientes.map((cliente, index) => [
      index + 1,
      cliente.fullName,
      cliente.dni,
      cliente.cellNumber,
      cliente.department,
      cliente.address,
      // Agrega más campos según los datos de tu entidad Cliente
    ]);

    const docDefinition = {
      content: [
        {
          text: 'Lista de Clientes',
          style: 'header',
        },
        {
          style: 'tableExample',
          table: {
            headerRows: 1,
            widths: [20, 160, 60, 70, 50, 100], // Ajusta las anchuras según tus necesidades
            body: [
              [
                {
                  text: 'N°',
                  bold: true,
                  fillColor: 'green',
                  color: 'white',
                }, // n1 con fondo verde
                {
                  text: 'Nombre',
                  bold: true,
                  fillColor: 'green',
                  color: 'white',
                }, // Título con fondo verde
                { text: 'Dni', bold: true, fillColor: 'green', color: 'white' }, // Título con fondo verde
                {
                  text: 'N° Celular',
                  bold: true,
                  fillColor: 'green',
                  color: 'white',
                }, // Título con fondo verde
                {
                  text: 'Departamento',
                  bold: true,
                  fillColor: 'green',
                  color: 'white',
                }, // Título con fondo verde
                {
                  text: 'Direccion',
                  bold: true,
                  fillColor: 'green',
                  color: 'white',
                }, // Título con fondo verde
                // Agrega más encabezados de columna según los campos de tu entidad Cliente
              ], // Encabezado de la tabla
              ...tableBody, // Datos de los clientes
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 10,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10], // Márgenes [arriba, izquierda, abajo, derecha]
        },

        tableExample: {
          margin: [0, 5, 0, 15], // Márgenes [arriba, izquierda, abajo, derecha]
        },
      },
    };

    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBuffer((buffer) => {
        resolve(buffer);
      });
    });

    return pdfBuffer;
  }
}
