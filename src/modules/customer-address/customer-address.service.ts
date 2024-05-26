import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CustomerAddress } from './entities/customer-address.entity'
import { Repository } from 'typeorm'
import { CustomerAddressDto } from './dto/customer-address.dto'

@Injectable()
export class CustomerAddressService {
  constructor(
    @InjectRepository(CustomerAddress)
    private readonly customerAddressRepository: Repository<CustomerAddress>,
  ) {}

  async getCustomerAddressByUserId(
    userId: string,
  ): Promise<{ customerAddresses: CustomerAddress[]; total: number }> {
    try {
      const [customerAddresses, total] =
        await this.customerAddressRepository.findAndCount({
          where: {
            customer: { id: userId },
            isDeleted: false,
          },
          order: {
            createdAt: 'DESC',
          },
        })

      return { customerAddresses, total }
    } catch (error) {
      throw error
    }
  }

  async getCustomerAddressById(
    userAddressId: string,
  ): Promise<CustomerAddress> {
    try {
      if (!userAddressId) throw new Error('Invalid Product Id')

      const customerAddress = await this.customerAddressRepository.findOne({
        where: { id: userAddressId, isDeleted: false },
      })

      return customerAddress
    } catch (error) {
      throw error
    }
  }

  async createCustomerAddress(
    customerAddressDto: CustomerAddressDto,
  ): Promise<CustomerAddress> {
    try {
      const createdProduct =
        await this.customerAddressRepository.create(customerAddressDto)

      const savedProduct =
        await this.customerAddressRepository.save(createdProduct)

      return savedProduct
    } catch (error) {
      throw error
    }
  }

  async updateCustomerAddress({
    userAddressId,
    customerAddressDto,
  }: {
    userAddressId: string
    customerAddressDto: CustomerAddressDto
  }): Promise<CustomerAddress> {
    try {
      const customerAddress = await this.getCustomerAddressById(userAddressId)

      if (!customerAddress) throw new Error('CustomerAddress is not found')

      const updateCustomerAddress = {
        ...customerAddress,
        ...customerAddressDto,
      }

      const updatedProduct = await this.customerAddressRepository.save(
        updateCustomerAddress,
      )

      return updatedProduct
    } catch (error) {
      throw error
    }
  }

  async deleteCustomerAddress({
    userAddressId,
  }: {
    userAddressId: string
  }): Promise<boolean> {
    try {
      const customerAddress = await this.getCustomerAddressById(userAddressId)

      if (!customerAddress) throw new Error('CustomerAddress is not found')

      const updatedCustomerAddress = {
        ...customerAddress,
        isDeleted: true,
      }

      await this.customerAddressRepository.save(updatedCustomerAddress)

      return true
    } catch (error) {
      throw error
    }
  }
}
