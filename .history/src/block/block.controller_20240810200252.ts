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
import { BlockService } from './block.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { validRoles } from 'src/auth/interfaces/valid-roles';
import { Auth } from 'src/auth/decorators/auth-decorator';

@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post('register')
  @Auth(validRoles.user)
  create(@Body() createBlockDto: CreateBlockDto) {
    return this.blockService.create(createBlockDto);
  }

  @Get('project/:projectId')
  @Auth(validRoles.user)
  findAll(@Param('projectId', ParseUUIDPipe) projectId: string) {
    return this.blockService.findAll(projectId);
  }

  @Get(':id')
  @Auth(validRoles.user)
  findOne(@Param('id') id: string) {
    return this.blockService.findOne(+id);
  }

  @Patch(':id')
  @Auth(validRoles.user)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBlockDto: UpdateBlockDto,
  ) {
    return this.blockService.update(id, updateBlockDto);
  }

  @Delete(':id')
  @Auth(validRoles.user)
  remove(@Param('id') id: string) {
    return this.blockService.remove(+id);
  }
}
