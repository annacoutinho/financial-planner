import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { EventsService } from './events.service';
import { ZodValidationPipe } from '../common/zod.pipe';
import { createEventSchema, updateEventSchema, type CreateEventDto, type UpdateEventDto } from './events.zod';
import { Event } from '@prisma/client';

@Controller('events')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createEventSchema)) body: CreateEventDto): Promise<Event> {
    return this.service.create(body);
  }

  @Get()
  findAll(): Promise<Event[]> {
    return this.service.findAll();
  }

  @Get('by-client/:clientId')
  findByClient(@Param('clientId', ParseIntPipe) clientId: number): Promise<Event[]> {
    return this.service.findByClient(clientId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateEventSchema)) body: UpdateEventDto
  ): Promise<Event> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ ok: boolean }> {
    return this.service.remove(id);
  }
}
