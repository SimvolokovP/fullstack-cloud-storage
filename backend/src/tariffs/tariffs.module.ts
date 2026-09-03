import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TariffsService } from './tariffs.service';
import { TariffsController } from './tariffs.controller';
import { TariffPlan } from './entities/tariff-plan.entity';
import { User } from '@/user/entities/user.entity';
import { UserModule } from '@/user/user.module';
import { MainSeed } from '@/shared/seeds/main.seed';

@Module({
  imports: [TypeOrmModule.forFeature([TariffPlan, User]), UserModule],
  controllers: [TariffsController],
  providers: [TariffsService, MainSeed],
  exports: [TariffsService],
})
export class TariffsModule {}
