import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event } from '@prisma/client';
import { CreateEventDto, UpdateEventDto } from './events.zod';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateEventDto): Promise<Event> {
 
    const client = await this.prisma.client.findUnique({ where: { id: data.clientId } });
    if (!client) throw new NotFoundException('Client not found');

    return this.prisma.event.create({ data });
  }

  findAll(): Promise<Event[]> {
    return this.prisma.event.findMany();
  }

  findByClient(clientId: number): Promise<Event[]> {
    return this.prisma.event.findMany({ where: { clientId } });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: number, data: UpdateEventDto): Promise<Event> {
    await this.findOne(id);
    return this.prisma.event.update({ where: { id }, data });
  }

  async remove(id: number): Promise<{ ok: boolean }> {
    await this.findOne(id);
    await this.prisma.event.delete({ where: { id } });
    return { ok: true };
  }
}
