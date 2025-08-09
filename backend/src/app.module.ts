import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './clients/clients.module';
import { GoalsModule } from './goals/goals.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [PrismaModule, ClientsModule, GoalsModule, WalletModule],
})
export class AppModule {}
