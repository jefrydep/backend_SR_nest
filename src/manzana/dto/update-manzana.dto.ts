import { PartialType } from '@nestjs/mapped-types';
import { CreateManzanaDto } from './create-manzana.dto';

export class UpdateManzanaDto extends PartialType(CreateManzanaDto) {}
