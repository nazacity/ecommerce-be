import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order } from './entity/order.entity'
import { Repository } from 'typeorm'
import { OrderDto } from './dto/order.dto'

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder(orderDto: OrderDto): Promise<Order> {
    try {
      const createdOrder = await this.orderRepository.create(orderDto)

      const savedOrder = await this.orderRepository.save(createdOrder)

      return savedOrder
    } catch (error) {
      throw error
    }
  }
}
