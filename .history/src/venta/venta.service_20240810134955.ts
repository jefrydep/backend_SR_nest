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
const PDFDocument = require('pdfkit-table');
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
          const roundedAmount = Math.round(monthlyFee * 10) / 10;
          return {
            amount: roundedAmount,
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

  // async generarPdf(): Promise<Buffer> {
  //   const pdfBuffer: Buffer = await new Promise(async (resolvePromise) => {
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
  //     // this.userRepository
  //     // .find()
  //     // .then((users) => {
  //     //   const usersData = [
  //     //     ['Nombre', 'Apellido', 'Peso', 'Talla'],
  //     //     // Aquí puedes rellenar los datos de los usuarios
  //     //     // Usar los datos de los usuarios que obtuviste de la base de datos
  //     //     ...users.map((user) => [
  //     //       user.name,
  //     //       user.documentNumber,
  //     //       user.email,
  //     //       user.phoneNumber,
  //     //       user.address,
  //     //       user.sale.length

  //     //     ]),
  //     //   ];
  //     const creditList =   await this.ventaRepository.find()      // const usersData = [
  //     //   ['Nombre', 'Apellido', 'Peso', 'Talla'],
  //     //   // Aquí puedes rellenar los datos de los usuarios
  //     //   ['Usuario 1', 'Apellido 1', '70 kg', '175 cm'],
  //     //   ['Usuario 2', 'Apellido 2', '65 kg', '170 cm'],
  //     //   // Agrega datos para los otros usuarios aquí
  //     // ];
  //     const usersData =  [
  //       ['Nombre', 'Apellido', 'Peso', 'Talla'],
  //       // Aquí puedes rellenar los datos de los usuarios
  //       ...users.map((user) => [
  //         user.name,

  //       ]),
  //     ];
  //     doc.table({
  //       headers: usersData[0],
  //       rows: usersData.slice(1),
  //       width: { min: 50, max: 150 },
  //       align: ['left', 'left', 'left', 'left'],
  //       padding: 5,
  //       margin: { top: 15 },
  //     });

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
  // async generarPdf(saleId: string): Promise<Buffer> {
  //   const pdfBuffer: Buffer = await new Promise(async (resolvePromise) => {
  //     const doc = new PDFDocument({
  //       size: 'LETTER',
  //     });

  //     // Encabezado de la página

  //     // Obtener la venta por ID
  //     const sale = await this.ventaRepository.findOne({
  //       where: { id: saleId },
  //       relations:['client','lot']
  //     });

  //     if (!sale) {
  //       throw new NotFoundException(`Venta with ID ${saleId} not found`);
  //     }
  //     console.log(sale);
  //     doc.registerFont('Helvetica-Bold', 'Helvetica-Bold');
  //     doc
  //       .font('Helvetica-Bold')
  //       .fontSize(10)
  //       .text('JefryDeveloper', 50, 10, { align: 'left' });

  //     doc.fontSize(16).text(' RESIDENCIAL PALOMINO', { align: 'center' });
  //     doc.text(` Total de venta: ${sale.amount}`);
  //     doc.text(`Credito:  } Inicial:${sale.initial}  `);
  //     doc.text(`  Cliente: ${sale.client.fullName}  `);
  //     doc.text(
  //       `Número de cuotas:${sale.installmentsNumber}   Inicial:${sale.initial}  `,
  //     );
  //     doc.moveDown();

  //     doc.text(` CRONOGRAMA DE PAGOS MENSUALES - VENTA AL CRÉDITO `);
  //     // Crear los datos para la tabla en el PDF
  //     const creditData = [
  //       ['Nro', 'Monto', 'Fecha de Pago'],
  //       ...sale.monthlyPayments.map((payment, index) => [
  //         index + 1,
  //         payment.amount, // Formato a 2 decimales
  //         payment.dueDate // Formato de fecha local
  //       ]),
  //     ];

  //     // Generar la tabla en el PDF
  //     doc.table({
  //       headers: creditData[0],
  //       rows: creditData.slice(1),
      
  //       width: { min: 50, max: 150 },
  //       align: ['center', 'right','left'],
  //       padding: 10,
  //       margin: { top: 15 },
  //       alternateRowStyle: {
  //         fillColor: '#F4F4F4', // Color de fondo para filas alternas
  //       },
  //       border: {
  //         width: 1,
  //         color: '#DDDDDD', // Color del borde
  //       },
  //     });

  //     // Finalizar el documento PDF
  //     const buffer: Buffer[] = [];
  //     doc.on('data', (data: Buffer) => buffer.push(data));
  //     doc.on('end', () => {
  //       const data = Buffer.concat(buffer);
  //       resolvePromise(data);
  //     });

  //     doc.end();
  //   });

  //   return pdfBuffer;
  // }

  async generarPdf(saleId: string): Promise<Buffer> {
    const pdfBuffer: Buffer = await new Promise(async (resolvePromise) => {
      const doc = new PDFDocument({
        size: 'LETTER',
      });

      // Encabezado de la página
      doc.registerFont('Helvetica-Bold', 'Helvetica-Bold');
      doc.registerFont('Helvetica', 'Helvetica');

      doc.font('Helvetica-Bold')
        .fontSize(12)
        .text('JefryDeveloper', 50, 10, { align: 'left' });

      doc.fontSize(16)
        .text('Reporte de Venta', { align: 'center' });
      doc.moveDown();

      // Obtener la venta por ID
      const sale = await this.ventaRepository.findOne({
        where: { id: saleId },
        relations: ['client', 'lot'],
      });

      if (!sale) {
        throw new NotFoundException(`Venta with ID ${saleId} not found`);
      }

      // Información general
      doc.font('Helvetica-Bold')
        .fontSize(12)
        // .text(`Índice: ${saleId}`, { align: 'center' })
        .text(`Nombre del Cliente: ${sale.client.fullName}`, { align: 'left' })
        .text(`Lote: ${sale.lot.loteCode}`, { align: 'left' })
        // .text(`Número de Cuotas: ${sale.monthlyPayments.length}`, { align: 'left' });

      doc.moveDown();

      // Encabezado de la tabla
      doc.font('Helvetica-Bold')
        .fontSize(12)
        .text('Cuotas Mensuales:', { align: 'left' });
      doc.moveDown();

      // Datos de la tabla
      const creditData = [
        ['Nro', 'FECHA DE PAGO', 'CUOTA MENSUAL'],
        ...sale.monthlyPayments.map((payment, index) => [
          index+1, // Índice
          payment.dueDate , // Monto
          payment.amount, // Fecha de Pago
        ]),
      ];

      // Configuración de la tabla
      const table = doc.table({
        
        headers: creditData[0],
        rows: creditData.slice(1),
        width: { 
          min: [10, 100, 100], // Ancho mínimo para cada columna
          max: [20, 150, 150]  // Ancho máximo para cada columna
        },

        align: ['center', 'right', 'left'],
        padding: 10,
        margin: { top: 15 },
        headerStyle: {
          font: 'Helvetica-Bold',
          fontSize: 12,
          color: '#FFFFFF',
          fillColor: '#4F81BD', // Color de fondo
          borderColor: '#4F81BD', // Color del borde
        },
        rowStyle: {
          font: 'Helvetica',
          fontSize: 10,
          color: '#000000',
          borderColor: '#DDDDDD', // Color del borde
        },
        alternateRowStyle: {
          fillColor: '#F4F4F4', // Color de fondo para filas alternas
        },
        border: {
          width: 1,
          color: '#DDDDDD', // Color del borde
        },
      });

      // Dibuja líneas verticales
      // doc.on('data', () => {
      //   const { x, y, width } = table;

      //   // Ajusta estos valores según el diseño de la tabla y el espaciado
      //   const columnWidth = width / creditData[0].length;

      //   // Dibuja las líneas verticales
      //   for (let i = 1; i < creditData[0].length; i++) {
      //     doc
      //       .moveTo(x + i * columnWidth, y)
      //       .lineTo(x + i * columnWidth, y + table.height)
      //       .strokeColor('#DDDDDD')
      //       .stroke();
      //   }
      // });

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
