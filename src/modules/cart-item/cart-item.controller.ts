import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common'
import { CartItemService } from './cart-item.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ResponseModel } from 'src/model/response.model'
import { CartItem } from './entity/cart-item.entity'
import { CartItemInsertDto } from './dto/cart-item.dto'
import { RequestClinicUserModel } from 'src/model/request.model'
import { ProductOptionService } from '../product-option/product-option.service'
import { CustomerJwtAuthGuard } from '../auth/guard/customer-auth.guard'

@ApiTags('Cart Item')
@Controller('cart-item')
export class CartItemController {
  constructor(
    private readonly cartItemService: CartItemService,
    private readonly productOptionService: ProductOptionService,
  ) {}

  @ApiBearerAuth('Customer Authorization')
  @UseGuards(CustomerJwtAuthGuard)
  @Post()
  async createCartItem(
    @Request() req: RequestClinicUserModel,
    @Body() cartItemInsertDto: CartItemInsertDto,
  ): Promise<ResponseModel<CartItem>> {
    try {
      const cart = req.user.cart
      const productOption =
        await this.productOptionService.getProductOptionById(
          cartItemInsertDto.productOptionId,
        )

      const data = {
        quantity: cartItemInsertDto.quantity,
        cart,
        productOption,
      }

      const createCustomer = await this.cartItemService.createCartItem(data)

      return { data: createCustomer }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @ApiBearerAuth('Customer Authorization')
  @UseGuards(CustomerJwtAuthGuard)
  @Put()
  async putCartItem(
    @Request() req: RequestClinicUserModel,
    @Body() cartItemInsertDto: CartItemInsertDto,
  ): Promise<ResponseModel<CartItem>> {
    try {
      const cart = req.user.cart

      const checkCartItem = req.user.cart.cartItemLists.find(
        (item) => item.productOption.id === cartItemInsertDto.productOptionId,
      )

      if (checkCartItem) {
        const data = {
          quantity: checkCartItem.quantity + cartItemInsertDto.quantity,
          cart,
          productOption: checkCartItem.productOption,
        }

        const updatedCartItem = await this.cartItemService.updateCartItem({
          id: checkCartItem.id,
          data,
        })

        return { data: updatedCartItem }
      } else {
        const productOption =
          await this.productOptionService.getProductOptionById(
            cartItemInsertDto.productOptionId,
          )

        const data = {
          quantity: cartItemInsertDto.quantity,
          cart,
          productOption,
        }

        const createCartItem = await this.cartItemService.createCartItem(data)

        return { data: createCartItem }
      }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @ApiBearerAuth('Customer Authorization')
  @UseGuards(CustomerJwtAuthGuard)
  @Patch('/:cartItemId')
  async updateCartItem(
    @Request() req: RequestClinicUserModel,
    @Param('cartItemId', new ParseUUIDPipe()) cartItemId: string,
    @Body() cartItemInsertDto: CartItemInsertDto,
  ): Promise<ResponseModel<CartItem | string>> {
    try {
      if (cartItemInsertDto.quantity === 0) {
        const deletedCartItem = await this.cartItemService.deleteCartItem({
          cartItemId,
        })

        if (deletedCartItem) {
          return { data: 'succeeded' }
        }
      } else {
        const cart = req.user.cart
        const productOption =
          await this.productOptionService.getProductOptionById(
            cartItemInsertDto.productOptionId,
          )

        const data = {
          quantity: cartItemInsertDto.quantity,
          cart,
          productOption,
        }

        const updatedCartItem = await this.cartItemService.updateCartItem({
          id: cartItemId,
          data,
        })

        return { data: updatedCartItem }
      }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @ApiBearerAuth('Customer Authorization')
  @UseGuards(CustomerJwtAuthGuard)
  @Delete('/:cartItemId')
  async deleteCustomer(
    @Param('cartItemId', new ParseUUIDPipe()) cartItemId: string,
  ): Promise<ResponseModel<string>> {
    try {
      const deletedCartItem = await this.cartItemService.deleteCartItem({
        cartItemId,
      })

      if (deletedCartItem) {
        return { data: 'succeeded' }
      }
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
