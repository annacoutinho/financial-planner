import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './clients/clients.module';
import { GoalsModule } from './goals/goals.module';
import { WalletModule } from './wallet/wallet.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [PrismaModule, ClientsModule, GoalsModule, WalletModule, EventsModule],
})
export class AppModule {}
