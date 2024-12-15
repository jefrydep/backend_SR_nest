import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { validRoles } from 'src/auth/interfaces/valid-roles';
import { Auth } from 'src/auth/decorators/auth-decorator';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Controller('sale')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  // @Post('register/:id/lote')
  // @Auth(validRoles.user, validRoles.admin)
  // create(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() createVentaDto: CreateVentaDto,
  //   @GetUser() user: User,
  // ) {
  //   return this.ventaService.create(id, createVentaDto,user);
  // }

  @Post('register')
  @Auth(validRoles.user)
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventaService.create(createVentaDto);
  }

  // @Get('findAll')
  // findAll() {
  //   return this.ventaService.findAll();
  // }
  @Get('project/:projectId')
  @Auth(validRoles.user)
  findAll(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.ventaService.findAll(projectId);
  }

  @Get(':id')
  @Auth(validRoles.user)
  findOne(@Param('id') id: string) {
    return this.ventaService.findOne(+id);
  }

  @Patch(':id')
  @Auth(validRoles.user)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVentaDto: UpdateVentaDto,
  ) {
    return this.ventaService.update(id, updateVentaDto);
  }

  @Delete(':id')
  @Auth(validRoles.user)
  remove(@Param('id') id: string) {
    return this.ventaService.remove(+id);
  }

  @Get('pdf/creditList/:id')
  @Auth(validRoles.user)
  async downloadPDF(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res,
  ): Promise<void> {
    const buffer = await this.ventaService.generarPdf(id);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer);
  }
  // @Get('pdf/:id')
  // async generatePdf(@Param('id',ParseUUIDPipe) id: string, @Res() res: Response) {
  //   try {
  //     const pdfBuffer = await this.ventaService.generarPdf(id);
  //     res.set({
  //       'Content-Type': 'application/pdf',
  //       'Content-Disposition': `attachment; filename="venta-${id}.pdf"`,
  //       'Content-Length': pdfBuffer.length,
  //     });
  //     res.end(pdfBuffer);
  //   } catch (error) {
  //     throw new NotFoundException(`Error generating PDF: ${error.message}`);
  //   }
  // }
}
