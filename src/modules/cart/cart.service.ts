import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cart } from './entity/cart.entity'
import { Repository } from 'typeorm'

const relations = ['cartItemLists.productOption.product']

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name)
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async getCartById(cartId: string): Promise<Cart> {
    this.logger.log('get-cart-by-id')
    try {
      const cart = await this.cartRepository.findOne({
        where: { id: cartId, isDeleted: false },
        relations,
      })

      return cart
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }

  async createCart(): Promise<Cart> {
    try {
      this.logger.log('create-cart')
      const createdCart = await this.cartRepository.create()

      const savedCart = await this.cartRepository.save(createdCart)

      return savedCart
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }
}
