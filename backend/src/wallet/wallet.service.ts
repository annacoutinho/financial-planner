import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Wallet } from '@prisma/client';
import { CreateWalletDto, UpdateWalletDto } from './wallet.zod';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateWalletDto): Promise<Wallet> {
    const client = await this.prisma.client.findUnique({ where: { id: data.clientId }});
    if (!client) throw new NotFoundException('Client not found');


    const sum = Object.values(data.allocation ?? {}).reduce((a,b)=>a+b, 0);
    if (sum && Math.abs(sum - 100) > 0.01) {
      throw new BadRequestException('Allocation must sum 100%');
    }

    return this.prisma.wallet.create({ data });
  }

  findByClient(clientId: number) {
    return this.prisma.wallet.findUnique({ where: { clientId }});
  }

  async update(id: number, data: UpdateWalletDto): Promise<Wallet> {
    const exists = await this.prisma.wallet.findUnique({ where: { id }});
    if (!exists) throw new NotFoundException('Wallet not found');

    if (data.allocation) {
      const sum = Object.values(data.allocation).reduce((a,b)=>a+b, 0);
      if (sum && Math.abs(sum - 100) > 0.01) {
        throw new BadRequestException('Allocation must sum 100%');
      }
    }
    return this.prisma.wallet.update({ where: { id }, data });
  }

  async remove(id: number) {
    const exists = await this.prisma.wallet.findUnique({ where: { id }});
    if (!exists) throw new NotFoundException('Wallet not found');
    await this.prisma.wallet.delete({ where: { id }});
    return { ok: true };
  }
  async alignment(clientId: number) {
  const [wallet, goalsSum] = await this.prisma.$transaction([
    this.prisma.wallet.findUnique({ where: { clientId } }),
    this.prisma.goal.aggregate({ where: { clientId }, _sum: { targetValue: true }})
  ]);

  if (!wallet) return { percent: 0, band: 'red' as const };

  const planned = goalsSum._sum.targetValue ?? 0;
  const current = wallet.totalValue;

  const percent = current === 0 ? 0 : Number(((planned / current) * 100).toFixed(2));

  const band =
    percent > 90 ? 'green'
    : percent >= 70 ? 'yellow-light'
    : percent >= 50 ? 'yellow-dark'
    : 'red';

  return { percent, band, planned, current };
}

}
