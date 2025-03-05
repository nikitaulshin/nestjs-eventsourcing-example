import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DealStatus } from '../models/deal-status.enum';
import { CreateDealDto } from '../controllers/dto/create-deal.dto';
import { UpdateDealDto } from '../controllers/dto/update-deal.dto';
import { DealEventRepository } from '../repositories/deal-event.repository';
import { DealEvent } from '../models/deal-event.model';
import { DealDto } from '../controllers/dto/deal.dto';
import { EventType } from '../common/enums/event-types.enum';

@Injectable()
export class DealService {
    constructor(
      private readonly dealEventRepository: DealEventRepository,
    ) {}

    async findAll(): Promise<DealDto[]> {
        const events = await this.dealEventRepository.getAllEvents();
        const eventsMap = events.reduce((acc, event) => {
            if (!acc[event.dealId]) {
                acc[event.dealId] = [event];
            } else {
                acc[event.dealId].push(event);
            }
            return acc;
        }, {} as Record<string, DealEvent[]>);

        return Object.values(eventsMap)
          .map(events => this.restoreState(events))
          .filter(deal => deal !== null);
    }

    async findById(id: string): Promise<DealDto | null> {
        const events = await this.dealEventRepository.findEventsByDealId(id);
        if (!events.length) {
            throw new NotFoundException(`Сделка с ID ${id} не найдена.`);
        }

        const deal = this.restoreState(events);
        if (deal === null) {
            throw new NotFoundException(`Сделка с ID ${id} не найдена.`);
        }

        return deal;
    }

    async create(dto: CreateDealDto): Promise<DealDto> {
        const dealId = uuidv4();
        const data = {
            ...dto,
          status: DealStatus.NEW,
        }
        await this.dealEventRepository.addEvent(dealId, EventType.CREATED, data);
        return { id: dealId, ...data, createdAt: new Date(), updatedAt: new Date() };
    }

    async update(id: string, data: UpdateDealDto): Promise<DealDto> {
        const existingDeal = await this.findById(id);
        if (!existingDeal) throw new NotFoundException(`Сделка с ID ${id} не найдена.`);

        await this.dealEventRepository.addEvent(id, EventType.UPDATED, data);
        return {
            ...existingDeal,
            ...data,
        }
    }

    async delete(id: string): Promise<DealDto> {
        const existingDeal = await this.findById(id);
        if (!existingDeal) throw new NotFoundException(`Сделка с ID ${id} не найдена.`);

        await this.dealEventRepository.addEvent(id, EventType.DELETED, {});
        return existingDeal;
    }

    private restoreState(events: DealEvent[]): DealDto | null {
        let deal: Partial<DealDto> | null = null;

        for (const event of events) {
            const { type, payload } = event;

            switch (type) {
                case EventType.CREATED:
                    deal = { ...payload as unknown as DealDto, };
                    break;
                case EventType.UPDATED:
                    if (deal) {
                        // @ts-ignore
                        deal = { ...deal, ...payload as unknown as DealDto };
                    }
                    break;
                case EventType.DELETED:
                    return null;
            }
        }

        return deal ? (deal as DealDto) : null;
    }
}