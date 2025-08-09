import { BadRequestException, NotFoundException } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { PrismaService } from '../prisma/prisma.service';

function prismaMock(): PrismaService {
  return {
    client: { findUnique: jest.fn() },
    wallet: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  } as any;
}

describe('WalletService', () => {
  let service: WalletService;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = prismaMock();
    service = new WalletService(prisma);
  });

  it('falha se allocation não somar 100', async () => {
    (prisma.client.findUnique as any).mockResolvedValue({ id: 1 });
    await expect(
      service.create({ clientId: 1, totalValue: 1000, allocation: { acoes: 60, rf: 30 } })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('cria quando soma 100', async () => {
    (prisma.client.findUnique as any).mockResolvedValue({ id: 1 });
    (prisma.wallet.create as any).mockResolvedValue({ id: 5, clientId: 1, totalValue: 1000, allocation: { a: 50, b: 50 } });
    const res = await service.create({ clientId: 1, totalValue: 1000, allocation: { a: 50, b: 50 } });
    expect(res.id).toBe(5);
  });

  it('update lança NotFound se não existir', async () => {
    (prisma.wallet.findUnique as any).mockResolvedValue(null);
    await expect(service.update(99, { totalValue: 10 })).rejects.toBeInstanceOf(NotFoundException);
  });
});
