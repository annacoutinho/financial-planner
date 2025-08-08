import { Controller, Get, Post, Body, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { GoalsService } from './goals.service';
import { ZodValidationPipe } from '../common/zod.pipe';
import { createGoalSchema, updateGoalSchema, type CreateGoalDto, type UpdateGoalDto } from './goals.zod';
import { Goal } from '@prisma/client';

@Controller('goals')
export class GoalsController {
  constructor(private readonly service: GoalsService) {}

  @Post()
  create(@Body(new ZodValidationPipe(createGoalSchema)) body: CreateGoalDto): Promise<Goal> {
    return this.service.create(body);
  }

  @Get()
  findAll(): Promise<Goal[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Goal> {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateGoalSchema)) body: UpdateGoalDto
  ): Promise<Goal> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<{ ok: boolean }> {
    return this.service.remove(id);
  }
}
