import { Injectable, Logger } from '@nestjs/common'
import { CustomerCreditHistory } from './entity/customer-credit-history.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CustomerCreateHistoryDto } from './dto/customer-credit-history.dto'

@Injectable()
export class CustomerCreditHistoryService {
  private readonly logger = new Logger(CustomerCreditHistoryService.name)
  constructor(
    @InjectRepository(CustomerCreditHistory)
    private readonly customerCreditHistoryRepository: Repository<CustomerCreditHistory>,
  ) {}

  async createCustomerCreditHistory(
    customerCreateHistoryDto: CustomerCreateHistoryDto,
  ): Promise<CustomerCreditHistory> {
    try {
      this.logger.log('create-customer-credit')

      const createdCustomerCreditHistory =
        await this.customerCreditHistoryRepository.create(
          customerCreateHistoryDto,
        )

      const savedCustomerCreditHistory =
        await this.customerCreditHistoryRepository.save(
          createdCustomerCreditHistory,
        )

      return savedCustomerCreditHistory
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }
}
