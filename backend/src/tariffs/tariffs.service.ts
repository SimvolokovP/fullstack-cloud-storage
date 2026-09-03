import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TariffPlan } from './entities/tariff-plan.entity';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';

@Injectable()
export class TariffsService {
  constructor(
    @InjectRepository(TariffPlan)
    private readonly tariffRepository: Repository<TariffPlan>,
  ) {}

  async create(dto: CreateTariffDto): Promise<TariffPlan> {
    const exists = await this.tariffRepository.findOne({
      where: { name: dto.name },
    });
    if (exists) {
      throw new ConflictException(
        'Тарифный план с таким названием уже существует',
      );
    }

    const tariff = this.tariffRepository.create(dto);
    return this.tariffRepository.save(tariff);
  }

  async findAll(): Promise<TariffPlan[]> {
    return this.tariffRepository.find({ order: { price: 'ASC' } });
  }

  async findOne(id: string): Promise<TariffPlan> {
    const tariff = await this.tariffRepository.findOne({ where: { id } });
    if (!tariff) {
      throw new NotFoundException('Тарифный план не найден');
    }
    return tariff;
  }

  async update(id: string, dto: UpdateTariffDto): Promise<TariffPlan> {
    const tariff = await this.findOne(id);

    if (dto.name && dto.name !== tariff.name) {
      const exists = await this.tariffRepository.findOne({
        where: { name: dto.name },
      });
      if (exists) {
        throw new ConflictException(
          'Тарифный план с таким названием уже существует',
        );
      }
    }

    this.tariffRepository.merge(tariff, dto);
    return this.tariffRepository.save(tariff);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const tariff = await this.findOne(id);
    await this.tariffRepository.remove(tariff);
    return { success: true };
  }
}
