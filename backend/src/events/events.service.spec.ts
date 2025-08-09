import { NotFoundException } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { PrismaService } from '../prisma/prisma.service';

function prismaMock(): PrismaService {
  return {
    client: { findUnique: jest.fn() },
    event: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as any;
}

describe('EventsService', () => {
  let service: EventsService;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = prismaMock();
    service = new EventsService(prisma);
  });

  it('cria evento quando client existe', async () => {
    (prisma.client.findUnique as any).mockResolvedValue({ id: 1 });
    (prisma.event.create as any).mockResolvedValue({ id: 10, clientId: 1, type: 'deposit', value: 100, frequency: 'once' });
    const res = await service.create({ clientId: 1, type: 'deposit', value: 100, frequency: 'once' });
    expect(res.id).toBe(10);
  });

  it('lança NotFound se client não existir', async () => {
    (prisma.client.findUnique as any).mockResolvedValue(null);
    await expect(service.create({ clientId: 999, type: 'deposit', value: 100, frequency: 'once' }))
      .rejects.toBeInstanceOf(NotFoundException);
  });

  it('findOne lança NotFound se não existir', async () => {
    (prisma.event.findUnique as any).mockResolvedValue(null);
    await expect(service.findOne(123)).rejects.toBeInstanceOf(NotFoundException);
  });
});
