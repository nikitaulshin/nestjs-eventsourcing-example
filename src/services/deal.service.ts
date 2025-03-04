import { Injectable, NotFoundException } from '@nestjs/common';
import { DealRepository } from '../repositories/deal.repository';
import { Deal } from '../models/deal.model';
import { DealStatus } from '../models/deal-status.enum';
import { CreateDealDto } from '../controllers/dto/create-deal.dto';
import { UpdateDealDto } from '../controllers/dto/update-deal.dto';
import { DealEventRepository } from '../repositories/deal-event.repository';
import { DealEvent } from '../models/deal-event.model';

@Injectable()
export class DealService {
    constructor(
      private readonly dealRepository: DealRepository,
      private readonly dealEventRepository: DealEventRepository,
    ) {}

    async create(data: CreateDealDto): Promise<Deal> {
        const deal = await this.dealRepository.create({
            ...data,
            status: DealStatus.NEW,
        });
        await this.dealEventRepository.addEvent(deal.id, 'CREATED', data);
        return deal;
    }

    async findAll(): Promise<Deal[]> {
        const deals = await this.dealRepository.findAll();
        const events = await this.dealEventRepository.findEventsByDealIds(deals.map(deal => deal.id));
        return deals
            .map(deal => this.applyEventsToDeal(deal, events.filter(event => event.dealId === deal.id)))
            .filter(deal => deal !== null);
    }

    async findById(id: string): Promise<Deal> {
        const deal = await this.dealRepository.findById(id);
        if (!deal) throw new NotFoundException(`Сделка с ID ${id} не найдена.`);
        const events = await this.dealEventRepository.findEventsByDealId(deal.id);

        return this.applyEventsToDeal(deal, events)!;
    }

    async update(id: string, data: UpdateDealDto): Promise<Deal> {
        const existingDeal = await this.dealRepository.findById(id);
        if (!existingDeal) throw new NotFoundException(`Сделка с ID ${id} не найдена.`);

        await this.dealEventRepository.addEvent(id, 'UPDATED', data);
        return { ...existingDeal, ...data, updatedAt: new Date() };
    }

    async delete(id: string): Promise<Deal> {
        const existingDeal = await this.dealRepository.findById(id);
        if (!existingDeal) throw new NotFoundException(`Сделка с ID ${id} не найдена.`);

        await this.dealEventRepository.addEvent(id, 'DELETED', {});
        return existingDeal;
    }

    private applyEventsToDeal(deal: Deal, events: DealEvent[]): Deal | null {
        for (const event of events) {
            const { type, payload, createdAt } = event;

            switch (type) {
                case 'UPDATED':
                    deal = { ...deal, ...payload as any, updatedAt: createdAt };
                    break;
                case 'DELETED':
                    return null;
            }
        }

        return deal;
    }
}