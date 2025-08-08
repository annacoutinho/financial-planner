import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ClientsModule } from './clients/clients.module';
import { GoalsModule } from './goals/goals.module';

@Module({
  imports: [PrismaModule, ClientsModule, GoalsModule],
})
export class AppModule {}
