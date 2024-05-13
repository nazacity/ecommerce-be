import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Cart } from './entity/cart.entity'
import { Repository } from 'typeorm'

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name)
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

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
