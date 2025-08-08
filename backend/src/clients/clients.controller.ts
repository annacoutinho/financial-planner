// backend/src/clients/clients.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
} from '@nestjs/common';
import { Client } from '@prisma/client';
import { ZodValidationPipe } from '../common/zod.pipe';
import { ClientsService } from './clients.service';
import {
  createClientSchema,
  updateClientSchema,
  type CreateClientDto,
  type UpdateClientDto,
} from './clients.zod';

@Controller('clients')
export class ClientsController {
  constructor(private readonly service: ClientsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createClientSchema))
  create(@Body() body: CreateClientDto): Promise<Client> {
    return this.service.create(body);
  }

  @Get()
  findAll(): Promise<Client[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Client> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateClientSchema)) body: UpdateClientDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ ok: boolean }> {
    return this.service.remove(id);
  }
}
