import { Injectable, NotFoundException } from '@nestjs/common';
import { DealRepository } from '../repositories/deal.repository';
import { Deal } from '../models/deal.model';
import { DealStatus } from '../models/deal-status.enum';
import { CreateDealDto } from '../controllers/dto/create-deal.dto';
import { UpdateDealDto } from '../controllers/dto/update-deal.dto';

@Injectable()
export class DealService {
    constructor(private readonly dealRepository: DealRepository) {}

    async create(data: CreateDealDto): Promise<Deal> {
        return this.dealRepository.create({
            ...data,
            status: DealStatus.NEW,
        });
    }

    async findAll(): Promise<Deal[]> {
        return this.dealRepository.findAll();
    }

    // Обработка ошибки, если сделка не найдена
    async findById(id: string): Promise<Deal> {
        const deal = await this.dealRepository.findById(id);
        if (!deal) {
            throw new NotFoundException(`Сделка с ID ${id} не найдена.`);
        }
        return deal;
    }

    async update(id: string, data: UpdateDealDto): Promise<Deal> {
        const existingDeal = await this.dealRepository.findById(id);
        if (!existingDeal) {
            throw new NotFoundException(`Сделка с ID ${id} не найдена.`);
        }
        return this.dealRepository.update(id, data);
    }

    async delete(id: string): Promise<Deal> {
        const deal = await this.dealRepository.findById(id);
        if (!deal) {
            throw new NotFoundException(`Сделка с ID ${id} не найдена.`);
        }
        return this.dealRepository.delete(id);
    }
}