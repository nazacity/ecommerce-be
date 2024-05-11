import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Customer } from './entities/customer.entity'
import {
  CustomerCreateDto,
  CustomerUpdateDto,
  CustomerUpdateQueryDto,
} from './dto/customer.dto'
import { paginationUtil } from 'src/utils/pagination'

const relations = []

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name)
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async getCustomers(query: CustomerUpdateQueryDto): Promise<{
    customers: Customer[]
    total: number
  }> {
    this.logger.log('get-customers')
    try {
      const { take, skip } = paginationUtil(query)

      const [customers, total] = await this.customerRepository.findAndCount({
        where: {
          isDeleted: false,
        },
        order: {
          createdAt: 'DESC',
        },
        take,
        skip,
      })

      return { customers, total }
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }

  async getCustomerById(customerId: string): Promise<Customer> {
    this.logger.log('get-customer-by-id')
    try {
      const customer = await this.customerRepository.findOne({
        where: { id: customerId, isDeleted: false },
        relations,
      })

      return customer
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }

  async getCustomerByLineId(lineId: string): Promise<Customer> {
    this.logger.log('get-customer-by-line-id')
    try {
      const customer = await this.customerRepository.findOne({
        where: { lineId: lineId, isDeleted: false },
        relations,
      })

      return customer
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }

  async createCustomer(
    customerCreateDto: CustomerCreateDto,
  ): Promise<Customer> {
    try {
      this.logger.log('create-customer')
      const createdCustomer = await this.customerRepository.create({
        ...customerCreateDto,
      })

      const savedCustomer = await this.customerRepository.save(createdCustomer)

      return savedCustomer
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }

  async updateCustomer({
    id,
    customerUpdate,
  }: {
    id: string
    customerUpdate: CustomerUpdateDto
  }): Promise<Customer> {
    try {
      this.logger.log('update-customer')
      const customer = await this.customerRepository.save({
        id,
        ...customerUpdate,
      })
      return customer
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }

  async deleteCustomer(customerId: string): Promise<boolean> {
    try {
      this.logger.log('delete-customer')
      await this.customerRepository.update(customerId, {
        isDeleted: true,
      })

      return true
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }
}
