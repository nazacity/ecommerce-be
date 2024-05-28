import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CustomerCredit } from './entities/customer-credit.entity'
import { Repository } from 'typeorm'

const relations = ['histories']

@Injectable()
export class CustomerCreditService {
  private readonly logger = new Logger(CustomerCreditService.name)
  constructor(
    @InjectRepository(CustomerCredit)
    private readonly customerCreditRepository: Repository<CustomerCredit>,
  ) {}

  async getCustomerCreditById(creditId: string): Promise<CustomerCredit> {
    this.logger.log('get-customer-credit-by-id')
    try {
      const customerCredit = await this.customerCreditRepository.findOne({
        where: {
          id: creditId,
          isDeleted: false,
        },
        order: {
          histories: {
            createdAt: 'DESC',
          },
        },
        relations,
      })

      return customerCredit
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }

  async getCustomerCreditByRecommentorCode(
    recommentorCode: string,
  ): Promise<CustomerCredit> {
    this.logger.log('get-customer-credit-by-recommentor-code')
    try {
      const customerCredit = await this.customerCreditRepository.findOne({
        where: {
          customer: {
            recommentorCode,
          },
          isDeleted: false,
        },
        relations,
      })

      return customerCredit
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }

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

  async updateCustomerCredit({
    creditId,
    amount,
  }: {
    creditId: string
    amount: number
  }): Promise<CustomerCredit> {
    try {
      this.logger.log('update-customer-credit')

      await this.customerCreditRepository.update(creditId, { amount })

      return this.getCustomerCreditById(creditId)
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }
}
