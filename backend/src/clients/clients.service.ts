
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Client } from '@prisma/client';
import { CreateClientDto, UpdateClientDto } from './clients.zod';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateClientDto): Promise<Client> {

    const exists = await this.prisma.client.findUnique({ where: { email: data.email } });
    if (exists) throw new ConflictException('Email já cadastrado');

    try {
      return await this.prisma.client.create({ data });
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === 'P2002'
      ) {
        throw new ConflictException('Email já cadastrado');
      }
      throw err;
    }
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

    if (data.email) {
      const other = await this.prisma.client.findUnique({ where: { email: data.email } });
      if (other && other.id !== id) throw new ConflictException('Email já cadastrado por outro cliente');
    }

    return this.prisma.client.update({ where: { id }, data });
  }

  async remove(id: number): Promise<{ ok: boolean }> {
    await this.findOne(id);
    await this.prisma.client.delete({ where: { id } });
    return { ok: true };
  }

  findByEmail(email: string): Promise<Client | null> {
    return this.prisma.client.findUnique({ where: { email } });
  }
}
