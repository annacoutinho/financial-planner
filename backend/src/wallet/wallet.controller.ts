import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Wallet } from '@prisma/client';
import { ZodValidationPipe } from '../common/zod.pipe';
import { WalletService } from './wallet.service';
import {
  createWalletSchema,
  updateWalletSchema,
  type CreateWalletDto,
  type UpdateWalletDto,
} from './wallet.zod';

@Controller('wallet')
export class WalletController {
  constructor(private readonly service: WalletService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createWalletSchema)) body: CreateWalletDto,
  ): Promise<Wallet> {
    return this.service.create(body);
  }

  @Get('by-client/:clientId')
  findByClient(@Param('clientId', ParseIntPipe) clientId: number) {
    return this.service.findByClient(clientId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateWalletSchema)) body: UpdateWalletDto,
  ): Promise<Wallet> {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
  @Get(':id/alignment')
  alignment(@Param('id', ParseIntPipe) id: number) {
    return this.service.alignment(id);
  }
}
