import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ManzanaService } from './manzana.service';
import { CreateManzanaDto } from './dto/create-manzana.dto';
import { UpdateManzanaDto } from './dto/update-manzana.dto';

@Controller('manzana')
export class ManzanaController {
  constructor(private readonly manzanaService: ManzanaService) {}

  @Post('register')
  create(@Body() createManzanaDto: CreateManzanaDto) {
    return this.manzanaService.create(createManzanaDto);
  }

  @Get('findAll')
  findAll() {
    return this.manzanaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manzanaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateManzanaDto: UpdateManzanaDto) {
    return this.manzanaService.update(+id, updateManzanaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.manzanaService.remove(+id);
  }
}
