import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/prisma.service';
import { DealEvent } from '@prisma/client';

@Injectable()
export class DealEventRepository {
  constructor(private prisma: PrismaService) {}

  async addEvent(dealId: string, type: string, payload: any): Promise<void> {
    await this.prisma.dealEvent.create({
      data: {
        dealId,
        type,
        payload,
      },
    });
  }

  async findEventsByDealId(id: string): Promise<DealEvent[]> {
    return this.prisma.dealEvent.findMany({
      where: { dealId: id },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findEventsByDealIds(ids: string[]): Promise<DealEvent[]> {
    return this.prisma.dealEvent.findMany({
      where: {
        dealId: {
          in: ids,
        }
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getAllEvents(): Promise<DealEvent[]> {
    return this.prisma.dealEvent.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }
}