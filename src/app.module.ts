import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from "./services/prisma.service";
import { DealController } from './controllers/deal.controller';
import { DealService } from './services/deal.service';
import { DealRepository } from './repositories/deal.repository';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [DealController],
  providers: [PrismaService, DealService, DealRepository],
})
export class AppModule {}
