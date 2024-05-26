import { Injectable } from '@nestjs/common'
import { OrderItem } from './entity/order-item.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { OrderItemDto } from './dto/order-item.dto'

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrderItem(orderItemDto: OrderItemDto): Promise<OrderItem> {
    try {
      const createdOrderItem =
        await this.orderItemRepository.create(orderItemDto)

      const savedOrderItem =
        await this.orderItemRepository.save(createdOrderItem)

      return savedOrderItem
    } catch (error) {
      throw error
    }
  }
}
