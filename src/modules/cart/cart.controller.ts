import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common'
import { CartService } from './cart.service'
import { RequestClinicUserModel } from 'src/model/request.model'
import { ResponseModel } from 'src/model/response.model'
import { Cart } from './entity/cart.entity'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CustomerJwtAuthGuard } from '../auth/guard/customer-auth.guard'

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiBearerAuth('Customer Authorization')
  @UseGuards(CustomerJwtAuthGuard)
  @Get('/cart-by-token')
  async getCartById(
    @Request() req: RequestClinicUserModel,
  ): Promise<ResponseModel<Cart>> {
    try {
      const cart = await this.cartService.getCartById(req.user.cart.id)

      return { data: cart }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }
}
