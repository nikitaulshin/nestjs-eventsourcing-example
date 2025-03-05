import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { DealService } from '../services/deal.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { DealDto } from './dto/deal.dto';

@Controller('deals')
@ApiTags('Сделки')  // Группа для Swagger
export class DealController {
    constructor(private readonly dealService: DealService) {}

    @Post()
    @ApiOperation({ summary: 'Создать новую сделку' })
    @ApiBody({ type: CreateDealDto })
    @ApiResponse({ status: 201, description: 'Сделка успешно создана.' })
    @ApiResponse({ status: 400, description: 'Некорректный ввод.' })
    async create(@Body() body: CreateDealDto): Promise<DealDto> {
        return this.dealService.create(body);
    }

    @Get()
    @ApiOperation({ summary: 'Получить все сделки' })
    @ApiResponse({ status: 200, description: 'Возвращает все сделки', type: [DealDto] })
    async findAll(): Promise<DealDto[]> {
        return this.dealService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить сделку по ID' })
    @ApiParam({ name: 'id', type: 'string', description: 'ID сделки' })
    @ApiResponse({ status: 200, description: 'Возвращает сделку', type: DealDto })
    @ApiResponse({ status: 404, description: 'Сделка не найдена.' })
    async findById(@Param('id') id: string): Promise<DealDto | null> {
        return this.dealService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Обновить сделку' })
    @ApiParam({ name: 'id', type: 'string', description: 'ID сделки', required: true })
    @ApiBody({ type: UpdateDealDto })
    @ApiResponse({ status: 200, description: 'Сделка успешно обновлена.', type: DealDto })
    @ApiResponse({ status: 404, description: 'Сделка не найдена.' })
    async update(@Param('id') id: string, @Body() body: UpdateDealDto): Promise<DealDto> {
        return this.dealService.update(id, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Удалить сделку' })
    @ApiParam({ name: 'id', type: 'string', description: 'ID сделки' })
    @ApiResponse({ status: 200, description: 'Сделка успешно удалена.', type: DealDto })
    @ApiResponse({ status: 404, description: 'Сделка не найдена.' })
    async remove(@Param('id') id: string): Promise<DealDto> {
        return this.dealService.delete(id);
    }
}
