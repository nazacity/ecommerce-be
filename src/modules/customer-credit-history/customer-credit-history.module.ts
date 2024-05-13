import { Module } from '@nestjs/common'
import { CustomerCreditHistoryService } from './customer-credit-history.service'
import { CustomerCreditHistoryController } from './customer-credit-history.controller'
import { CustomerCreditHistory } from './entity/customer-credit-history.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([CustomerCreditHistory])],
  controllers: [CustomerCreditHistoryController],
  providers: [CustomerCreditHistoryService],
  exports: [CustomerCreditHistoryService],
})
export class CustomerCreditHistoryModule {}
