import { Module } from '@nestjs/common'
import { CustomerCreditService } from './customer-credit.service'
import { CustomerCreditController } from './customer-credit.controller'
import { CustomerCredit } from './entities/customer-credit.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([CustomerCredit])],
  controllers: [CustomerCreditController],
  providers: [CustomerCreditService],
  exports: [CustomerCreditService],
})
export class CustomerCreditModule {}
