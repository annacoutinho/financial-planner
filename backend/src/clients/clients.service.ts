
// backend/src/clients/clients.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Client } from '@prisma/client';
import { CreateClientDto, UpdateClientDto } from './clients.zod';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateClientDto): Promise<Client> {
    return this.prisma.client.create({ data });
  }

  findAll(): Promise<Client[]> {
    return this.prisma.client.findMany();
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async update(id: number, data: UpdateClientDto): Promise<Client> {
    await this.findOne(id);
    return this.prisma.client.update({ where: { id }, data });
  }

  async remove(id: number): Promise<{ ok: boolean }> {
    await this.findOne(id);
    await this.prisma.client.delete({ where: { id } });
    return { ok: true };
  }
}
