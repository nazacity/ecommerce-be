import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CustomerCredit } from './entities/customer-credit.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CustomerCreditService {
  private readonly logger = new Logger(CustomerCreditService.name)
  constructor(
    @InjectRepository(CustomerCredit)
    private readonly customerCreditRepository: Repository<CustomerCredit>,
  ) {}

  async createCustomerCredit(): Promise<CustomerCredit> {
    try {
      this.logger.log('create-customer-credit')

      const createdCustomerCredit = await this.customerCreditRepository.create({
        amount: 0.0,
      })

      const savedCustomerCredit = await this.customerCreditRepository.save(
        createdCustomerCredit,
      )

      return savedCustomerCredit
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }
}
