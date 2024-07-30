import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post('register')
  create(@Body() createBlockDto: CreateBlockDto) {
    return this.blockService.create(createBlockDto);
  }

  @Get('project/:projectId')
  findAll(@Param('projectId',ParseUUIDPipe)projectId:string) {
    return this.blockService.findAll(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blockService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id',ParseUUIDPipe) id: string, @Body() updateBlockDto: UpdateBlockDto) {
    return this.blockService.update(id, updateBlockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blockService.remove(+id);
  }
}
