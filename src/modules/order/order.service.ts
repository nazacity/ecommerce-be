import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Order, OrderStatus } from './entity/order.entity'
import { Between, Repository } from 'typeorm'
import {
  OrderDto,
  OrderQueryByDateDto,
  OrderQueryByUserDto,
  OrderQueryDto,
  OrderUpdateShippingInformationDto,
  OrderUpdateStatusDto,
  OrderUpdateTransferSlipImageUrlDto,
} from './dto/order.dto'
import { paginationUtil } from 'src/utils/pagination'

const relations = ['orderItems.productOption.product']

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name)
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getOrderById(orderId: string): Promise<Order> {
    try {
      const order = await this.orderRepository.findOne({
        where: {
          id: orderId,
          isDeleted: false,
        },
        relations,
      })

      return order
    } catch (error) {
      throw error
    }
  }

  async getOrders(
    query: OrderQueryDto,
  ): Promise<{ products: Order[]; total: number }> {
    try {
      const { take, skip } = paginationUtil(query)
      const [products, total] = await this.orderRepository.findAndCount({
        where: {
          ...(query.status && {
            status: query.status,
          }),
          ...(query.from &&
            query.to && {
              createdAt: Between(
                new Date(new Date(query.from).setHours(0, 0, 0, 0)),
                new Date(new Date(query.to).setHours(23, 59, 59, 0)),
              ),
            }),
        },
        order: {
          createdAt: 'DESC',
        },
        take,
        skip,
        relations,
      })

      return { products, total }
    } catch (error) {
      throw error
    }
  }

  async getOrderByDate(
    query: OrderQueryByDateDto,
  ): Promise<{ products: Order[]; total: number }> {
    try {
      const [products, total] = await this.orderRepository.findAndCount({
        where: {
          createdAt: Between(
            new Date(new Date(query.date).setHours(0, 0, 0, 0)),
            new Date(new Date(query.date).setHours(23, 59, 59, 0)),
          ),
        },
        order: {
          createdAt: 'DESC',
        },
        relations,
      })

      return { products, total }
    } catch (error) {
      throw error
    }
  }

  async getOrdersByUserId({
    userId,
    query,
  }: {
    userId: string
    query: OrderQueryByUserDto
  }): Promise<{ orders: Order[]; total: number }> {
    this.logger.log('get-orders-by-user-id')
    try {
      const { take, skip } = paginationUtil(query)

      const [orders, total] = await this.orderRepository.findAndCount({
        where: {
          customer: {
            id: userId,
          },
          isDeleted: false,
        },
        order: {
          createdAt: 'desc',
        },
        take,
        skip,
        relations,
      })

      return { orders, total }
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }

  async createOrder(orderDto: OrderDto): Promise<Order> {
    try {
      this.logger.log('create-order')
      const createdOrder = await this.orderRepository.create(orderDto)

      const savedOrder = await this.orderRepository.save(createdOrder)

      return savedOrder
    } catch (error) {
      throw error
    }
  }

  async updateOrderShippingInformation({
    orderId,
    orderUpdateDto,
  }: {
    orderId: string
    orderUpdateDto: OrderUpdateShippingInformationDto
  }): Promise<Order> {
    try {
      this.logger.log('update-order-shipping-information')

      await this.orderRepository.update(orderId, {
        ...orderUpdateDto,
        status: OrderStatus.sent,
      })

      return this.getOrderById(orderId)
    } catch (error) {
      throw error
    }
  }

  async updateOrderTransferSlipImageUrl({
    orderId,
    orderUpdateDto,
  }: {
    orderId: string
    orderUpdateDto: OrderUpdateTransferSlipImageUrlDto
  }): Promise<Order> {
    try {
      this.logger.log('update-order-transfer-slip-image-url')

      await this.orderRepository.update(orderId, {
        ...orderUpdateDto,
        status: OrderStatus.waiting_checking,
      })

      return this.getOrderById(orderId)
    } catch (error) {
      throw error
    }
  }

  async updateOrderStatus({
    orderId,
    orderUpdateDto,
  }: {
    orderId: string
    orderUpdateDto: OrderUpdateStatusDto
  }): Promise<Order> {
    try {
      this.logger.log('update-order-status')

      await this.orderRepository.update(orderId, orderUpdateDto)

      return this.getOrderById(orderId)
    } catch (error) {
      throw error
    }
  }

  async updateOrdeStatusCancel({
    orderId,
  }: {
    orderId: string
  }): Promise<Order> {
    try {
      this.logger.log('update-order-transfer-slip-image-url')

      await this.orderRepository.update(orderId, {
        status: OrderStatus.canceled,
      })

      return this.getOrderById(orderId)
    } catch (error) {
      throw error
    }
  }
}
