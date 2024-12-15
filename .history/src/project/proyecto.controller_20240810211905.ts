import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { Auth } from 'src/auth/decorators/auth-decorator';
import { validRoles } from 'src/auth/interfaces/valid-roles';

@Controller('project')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post('register')
  // @Auth(validRoles.user)
  create(@Body() createProyectoDto: CreateProyectoDto) {
    return this.proyectoService.create(createProyectoDto);
  }

  @Get('findAll')
  // @Auth(validRoles.user)
  findAll() {
    return this.proyectoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.proyectoService.findOne(id);
  }

  @Patch(':id')
  @Auth(validRoles.user)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProyectoDto: UpdateProyectoDto,
  ) {
    return this.proyectoService.update(id, updateProyectoDto);
  }

  @Delete(':id')
  @Auth(validRoles.user)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.proyectoService.remove(id);
  }
  // @Delete(':id')
  // remove(@Param('id',ParseUUIDPipe) id: string) {
  //   return this.clienteService.remove(id);
  // }
}
