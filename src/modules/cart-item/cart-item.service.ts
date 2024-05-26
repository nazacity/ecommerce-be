import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CartItem } from './entity/cart-item.entity'
import { Repository } from 'typeorm'
import { CartItemDto } from './dto/cart-item.dto'

const relations = ['productOption.product', 'productOption.discounts']

@Injectable()
export class CartItemService {
  private readonly logger = new Logger(CartItemService.name)
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async getCartItemById(customerId: string): Promise<CartItem> {
    this.logger.log('get-customer-by-id')
    try {
      const customer = await this.cartItemRepository.findOne({
        where: { id: customerId, isDeleted: false },
        order: {
          productOption: {
            discounts: {
              quantity: 'ASC',
            },
          },
        },
        relations,
      })

      return customer
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }

  async createCartItem(data: CartItemDto): Promise<CartItem> {
    try {
      this.logger.log('create-cart-item')

      const createdCartItem = await this.cartItemRepository.create(data)

      const savedCartItem = await this.cartItemRepository.save(createdCartItem)

      return savedCartItem
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }

  async updateCartItem({
    id,
    data,
  }: {
    id: string
    data: CartItemDto
  }): Promise<CartItem> {
    try {
      this.logger.log('update-cart-item')

      const cartItem = await this.getCartItemById(id)

      if (!cartItem) throw new Error('Cart Item is not found')

      const updatedCartItem = await this.cartItemRepository.save({
        id,
        ...data,
      })
      return updatedCartItem
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }

  async deleteCartItem({
    cartItemId,
  }: {
    cartItemId: string
  }): Promise<boolean> {
    try {
      this.logger.log('delete-cart-item')

      await this.cartItemRepository.delete(cartItemId)

      return true
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }
}
