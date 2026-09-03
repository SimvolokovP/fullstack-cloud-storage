import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TariffsService } from './tariffs.service';
import { TariffPlan } from './entities/tariff-plan.entity';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { UserRole } from '@/user/enums/user-role.enum';

@ApiTags('Tariff Plans')
@Controller('tariffs')
export class TariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый тарифный план (Доступно: Admin)' })
  @ApiResponse({ status: HttpStatus.CREATED, type: TariffPlan })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Название тарифа занято',
  })
  @Authorization(UserRole.ADMIN)
  async create(@Body() dto: CreateTariffDto): Promise<TariffPlan> {
    return this.tariffsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех тарифных планов' })
  @ApiResponse({ status: HttpStatus.OK, type: [TariffPlan] })
  async findAll(): Promise<TariffPlan[]> {
    return this.tariffsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить тарифный план по ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID тарифного плана' })
  @ApiResponse({ status: HttpStatus.OK, type: TariffPlan })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Тариф не найден' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TariffPlan> {
    return this.tariffsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Обновить параметры тарифного плана (Доступно: Admin)',
  })
  @ApiParam({ name: 'id', type: String, description: 'UUID тарифного плана' })
  @ApiResponse({ status: HttpStatus.OK, type: TariffPlan })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Тариф не найден' })
  @Authorization(UserRole.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTariffDto,
  ): Promise<TariffPlan> {
    return this.tariffsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить тарифный план (Доступно: Admin)' })
  @ApiParam({ name: 'id', type: String, description: 'UUID тарифного плана' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Тариф успешно удален' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Тариф не найден' })
  @Authorization(UserRole.ADMIN)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tariffsService.remove(id);
  }
}
