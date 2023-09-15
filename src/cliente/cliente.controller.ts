import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Res } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { query } from 'express';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth-decorator';
import { validRoles } from 'src/auth/interfaces/valid-roles';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Post('register')
  @Auth(validRoles.user)
  create(@Body() createClienteDto: CreateClienteDto,
  @GetUser() user:User,
  ) {
    return this.clienteService.create(createClienteDto,user);
  }

  @Get('findAll')
  findAll(@Query()paginationDto:PaginationDto) {
    return this.clienteService.findAll(paginationDto)
  }

  @Get(':id')
  findOne(@Param('id',ParseUUIDPipe) id: string) {
    return this.clienteService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateClienteDto: UpdateClienteDto) {
    return this.clienteService.update(id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseUUIDPipe) id: string) {
    return this.clienteService.remove(id);
  }


  @Get("pdf/donwload")
  async downloadPDF(@Res() res): Promise<void> {
    const buffer = await this.clienteService.generarPdfClientes();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=example.pdf',
      'Content-Length': buffer.length,
    })

    res.end(buffer);
  }
}
