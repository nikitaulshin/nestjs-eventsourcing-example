import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { DealStatus } from '../../models/deal-status.enum';
import { BaseDealDto } from './base-deal.dto';

export class UpdateDealDto extends BaseDealDto {
    @ApiProperty({ description: 'Статус сделки', enum: DealStatus, required: false })
    @IsOptional()
    @IsEnum(DealStatus)
    status?: DealStatus;
}