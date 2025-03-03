import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Deal } from '../models/deal.model';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class DealRepository {
    constructor(private prisma: PrismaService) {}

    async create(data: Prisma.DealCreateInput): Promise<Deal> {
        return this.prisma.deal.create({ data });
    }

    async findAll(): Promise<Deal[]> {
        return this.prisma.deal.findMany();
    }

    async findById(id: string): Promise<Deal | null> {
        return this.prisma.deal.findUnique({ where: { id } });
    }

    async update(id: string, data: Prisma.DealUpdateInput): Promise<Deal> {
        return this.prisma.deal.update({ where: { id }, data });
    }

    async delete(id: string): Promise<Deal> {
        return this.prisma.deal.delete({ where: { id } });
    }
}