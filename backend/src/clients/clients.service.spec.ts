import { ConflictException, NotFoundException } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { PrismaService } from '../prisma/prisma.service';

function createPrismaMock() {
  return {
    client: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as unknown as PrismaService;
}

describe('ClientsService', () => {
  let service: ClientsService;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new ClientsService(prisma);
  });

  it('cria cliente', async () => {
    (prisma.client.findUnique as any).mockResolvedValue(null);
    (prisma.client.create as any).mockResolvedValue({ id: 1, name: 'Anna', email: 'a@a.com', age: 30, isActive: true, familyProfile: 'single' });

    const res = await service.create({ name: 'Anna', email: 'a@a.com', age: 30, isActive: true, familyProfile: 'single' });
    expect(res.id).toBe(1);
    expect(prisma.client.create).toHaveBeenCalled();
  });

  it('lança ConflictException se email já existir', async () => {
    (prisma.client.findUnique as any).mockResolvedValue({ id: 99 });
    await expect(
      service.create({ name: 'Anna', email: 'a@a.com', age: 30, isActive: true, familyProfile: 'single' })
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('findOne lança NotFound se não existir', async () => {
    (prisma.client.findUnique as any).mockResolvedValue(null);
    await expect(service.findOne(123)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('update impede colisão de email', async () => {
    (prisma.client.findUnique as any)
      .mockResolvedValueOnce({ id: 1 })
      .mockResolvedValueOnce({ id: 2 });
    await expect(service.update(1, { email: 'x@x.com' })).rejects.toBeInstanceOf(ConflictException);
  });
});
