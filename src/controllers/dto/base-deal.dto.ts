import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class BaseDealDto {
  @ApiProperty({ description: 'Название сделки' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Описание сделки', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Сумма сделки' })
  @IsNumber()
  amount: number;
}