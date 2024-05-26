import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { OrderService } from './order.service'
import { CustomerAddressService } from '../customer-address/customer-address.service'
import { OrderItemService } from '../order-item/order-item.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CustomerJwtAuthGuard } from '../auth/guard/customer-auth.guard'
import { OrderCreateDto, OrderDto } from './dto/order.dto'
import { RequestClinicUserModel } from 'src/model/request.model'
import { ResponseModel } from 'src/model/response.model'
import { Order, OrderStatus } from './entity/order.entity'
import { CartItemService } from '../cart-item/cart-item.service'
import { OrderItemDto } from '../order-item/dto/order-item.dto'
import * as _ from 'lodash'

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly customerAddressService: CustomerAddressService,
    private readonly orderItemService: OrderItemService,
    private readonly cartItemService: CartItemService,
  ) {}

  @ApiBearerAuth('Customer Authorization')
  @UseGuards(CustomerJwtAuthGuard)
  @Post()
  async createCustomerAddress(
    @Request() req: RequestClinicUserModel,
    @Body() orderCreateDto: OrderCreateDto,
  ): Promise<ResponseModel<Order>> {
    try {
      const address = await this.customerAddressService.getCustomerAddressById(
        orderCreateDto.addressId,
      )

      const cartItemLists = await Promise.all(
        orderCreateDto.cartItemIds.map((item) => {
          return this.cartItemService.getCartItemById(item)
        }),
      )

      const orderItems = await Promise.all(
        cartItemLists.map((item) => {
          const discount = _.orderBy(
            item.productOption?.discounts,
            ['quantity'],
            ['desc'],
          ).find((i) => i.quantity <= item.quantity)

          const total = discount
            ? item.quantity * item.productOption.price - discount.discount
            : item.quantity * item.productOption.price

          const data: OrderItemDto = {
            quantity: item.quantity,
            discount: discount.discount || 0,
            total,
            productOption: item.productOption,
          }

          return this.orderItemService.createOrderItem(data)
        }),
      )

      const amount = orderItems.reduce((previousValue, item) => {
        return previousValue + item.productOption.price * item.quantity
      }, 0)

      const discount = orderItems.reduce((previousValue, item) => {
        return previousValue + item.discount
      }, 0)

      const total = amount - discount + parseFloat(Math.random().toFixed(2))

      const data: OrderDto = {
        amount,
        discount,
        total,
        status: OrderStatus.waiting_payment,
        trackingNo: '',
        trackingCompanyName: '',
        transferSlipImageUrl: '',
        address,
        customer: req.user,
        orderItems,
      }

      const order = await this.orderService.createOrder(data)

      await Promise.all(
        cartItemLists.map((item) => {
          return this.cartItemService.deleteCartItem({ cartItemId: item.id })
        }),
      )

      return { data: order }
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
