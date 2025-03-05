import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from "./services/prisma.service";
import { DealController } from './controllers/deal.controller';
import { DealService } from './services/deal.service';
import { DealEventRepository } from './repositories/deal-event.repository';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [DealController],
  providers: [PrismaService, DealService, DealEventRepository],
})
export class AppModule {}
