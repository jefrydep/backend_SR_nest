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
import { LoteService } from './lote.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { validRoles } from 'src/auth/interfaces/valid-roles';
import { Auth } from 'src/auth/decorators/auth-decorator';

@Controller('lot')
export class LoteController {
  constructor(private readonly loteService: LoteService) {}

  @Post('register')
  @Auth(validRoles.user)
  create(@Body() createLoteDto: CreateLoteDto) {
    return this.loteService.create(createLoteDto);
  }

  // @Get('findAll')
  // findAll() {
  //   return this.loteService.findAll();
  // }

  @Get('project/:projectId')
  @Auth(validRoles.user)
  findAll(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.loteService.findAll(projectId);
  }

  @Get(':id')
  @Auth(validRoles.user)
  findOne(@Param('id') id: string) {
    return this.loteService.findOne(+id);
  }

  @Patch(':id')
  @Auth(validRoles.user)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLoteDto: UpdateLoteDto,
  ) {
    return this.loteService.update(id, updateLoteDto);
  }

  @Delete(':id')
  @Auth(validRoles.user)
  remove(@Param('id') id: string) {
    return this.loteService.remove(+id);
  }
}
