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
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventaService.create(createVentaDto);
  }

  @Get('findAll')
  findAll() {
    return this.ventaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventaService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateVentaDto: UpdateVentaDto,
  ) {
    return this.ventaService.update(id, updateVentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventaService.remove(+id);
  }
}
