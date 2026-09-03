import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'argon2';
import { User } from '../../user/entities/user.entity';
import { TariffPlan } from '../../tariffs/entities/tariff-plan.entity';
import { UserRole } from '../../user/enums/user-role.enum';
import { AuthMethod } from '../../auth/enums/auth-method.enum';

@Injectable()
export class MainSeed implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(TariffPlan)
    private readonly tariffRepository: Repository<TariffPlan>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedTariffs();
    await this.seedAdmin();
  }

  private async seedTariffs() {
    const tariffs = [
      {
        name: 'Free',
        description: 'Базовый тарифный план для ознакомления',
        maxSpace: 5368709120,
        maxFileSize: 104857600,
        price: 0.0,
        isActive: true,
      },
      {
        name: 'Standard',
        description: 'Оптимальный тарифный план для личного использования',
        maxSpace: 53687091200,
        maxFileSize: 2147483648,
        price: 199.0,
        isActive: true,
      },
      {
        name: 'Premium',
        description: 'Максимальные возможности для хранения больших файлов',
        maxSpace: 536870912000,
        maxFileSize: 26843545600,
        price: 499.0,
        isActive: true,
      },
    ];

    for (const tariff of tariffs) {
      const exists = await this.tariffRepository.findOne({
        where: { name: tariff.name },
      });
      if (!exists) {
        const newTariff = this.tariffRepository.create(tariff);
        await this.tariffRepository.save(newTariff);
      }
    }
  }

  private async seedAdmin() {
    const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || 'admin@cloudbox.local';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;
    const exists = await this.userRepository.findOne({
      where: { email: adminEmail },
    });

    if (!exists) {
      const freeTariff = await this.tariffRepository.findOne({
        where: { name: 'Free' },
      });
      const hashedPassword = await hash(adminPassword || 'AdminCloudBox2026');

      const admin = this.userRepository.create({
        email: adminEmail,
        password: hashedPassword,
        displayName: 'Administrator',
        picture: null,
        role: UserRole.ADMIN,
        isVerified: true,
        isTwoFactorEnabled: false,
        method: AuthMethod.CREDENTIALS,
        allocatedSpace: freeTariff ? freeTariff.maxSpace : 5368709120,
        usedSpace: 0,
        tariffPlan: freeTariff,
      });

      await this.userRepository.save(admin);
    }
  }
}
