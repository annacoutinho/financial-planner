// goals.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Goal, Client } from '@prisma/client';
import {
  CreateGoalDto,
  UpdateGoalDto,
} from './goals.zod';

@Injectable()
export class GoalsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateGoalDto): Promise<Goal> {
 
    const exists: Client | null = await this.prisma.client.findUnique({
      where: { id: data.clientId },
    });

    if (!exists) {
      throw new NotFoundException('Client not found');
    }

    try {
      return await this.prisma.goal.create({
        data: {
          type: data.type,
          targetValue: data.targetValue,
          targetDate: data.targetDate,
          client: { connect: { id: data.clientId } },
        },
      });
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code: string }).code === 'P2003'
      ) {
        throw new BadRequestException('Invalid clientId');
      }
      throw error;
    }
  }

  findAll(): Promise<Goal[]> {
    return this.prisma.goal.findMany();
  }

  async findOne(id: number): Promise<Goal> {
    const goal: Goal | null = await this.prisma.goal.findUnique({
      where: { id },
    });

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    return goal;
  }

  async update(id: number, data: UpdateGoalDto): Promise<Goal> {
    await this.findOne(id);
    return this.prisma.goal.update({ where: { id }, data });
  }

  async remove(id: number): Promise<{ ok: boolean }> {
    await this.findOne(id);
    await this.prisma.goal.delete({ where: { id } });
    return { ok: true };
  }
}
