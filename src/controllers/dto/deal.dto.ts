import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import {DealStatus} from "../../models/deal-status.enum";
import { BaseDealDto } from './base-deal.dto';

export class DealDto extends BaseDealDto {
    @ApiProperty({ description: 'ID сделки' })
    @IsUUID()
    id: string;

    @ApiProperty({ description: 'Статус сделки', enum: DealStatus })
    @IsEnum(DealStatus)
    status: DealStatus;

    @ApiProperty({ description: 'Дата и время создания сделки' })
    createdAt: Date;

    @ApiProperty({ description: 'Дата и время последнего обновления сделки'})
    updatedAt: Date;
}