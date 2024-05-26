import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { OrderService } from './order.service'
import { CustomerAddressService } from '../customer-address/customer-address.service'
import { OrderItemService } from '../order-item/order-item.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { CustomerJwtAuthGuard } from '../auth/guard/customer-auth.guard'
import {
  OrderCreateDto,
  OrderDto,
  OrderQueryByUserDto,
  OrderQueryDto,
} from './dto/order.dto'
import { RequestClinicUserModel } from 'src/model/request.model'
import { ResponseModel } from 'src/model/response.model'
import { Order, OrderStatus } from './entity/order.entity'
import { CartItemService } from '../cart-item/cart-item.service'
import { OrderItemDto } from '../order-item/dto/order-item.dto'
import * as _ from 'lodash'
import * as dayjs from 'dayjs'
import { AdminJwtAuthGuard } from '../auth/guard/admin-auth.guard'

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly customerAddressService: CustomerAddressService,
    private readonly orderItemService: OrderItemService,
    private readonly cartItemService: CartItemService,
  ) {}

  @ApiBearerAuth('Admin Authorization')
  @UseGuards(AdminJwtAuthGuard)
  @Get()
  async getOrders(
    @Query() query: OrderQueryDto,
  ): Promise<ResponseModel<Order[]>> {
    try {
      const { products, total } = await this.orderService.getOrders(query)
      return {
        meta: {
          total,
        },
        data: products,
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
  @Get('/orders-by-token')
  async getOrdersByToken(
    @Request() req: RequestClinicUserModel,
    @Query() query: OrderQueryByUserDto,
  ): Promise<ResponseModel<Order[]>> {
    try {
      const { orders, total } = await this.orderService.getOrdersByUserId({
        userId: req.user.id,
        query,
      })
      return {
        meta: {
          total,
        },
        data: orders,
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

  @Get('/:orderId')
  async getOrderById(
    @Param('orderId', new ParseUUIDPipe()) orderId: string,
  ): Promise<ResponseModel<Order>> {
    try {
      const order = await this.orderService.getOrderById(orderId)

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
        cartItemLists
          .filter((a) => a)
          .map((item) => {
            const discount = _.orderBy(
              item.productOption?.discounts,
              ['quantity'],
              ['desc'],
            ).find((i) => i.quantity <= item.quantity)

            let total = item.quantity * item.productOption.price
            if (discount) {
              total =
                item.quantity * item.productOption.price - discount.discount
            }

            const data: OrderItemDto = {
              quantity: item.quantity,
              discount: discount?.discount || 0,
              total,
              productOption: item.productOption,
            }

            return this.orderItemService.createOrderItem(data)
          }),
      )

      console.log(orderItems)

      const amount = orderItems.reduce((previousValue, item) => {
        return previousValue + item.productOption.price * item.quantity
      }, 0)

      console.log(amount)

      const discount = orderItems.reduce((previousValue, item) => {
        return previousValue + item.discount
      }, 0)

      console.log(discount)

      const total = amount - discount + parseFloat(Math.random().toFixed(2))

      const { total: ordersTotal } = await this.orderService.getOrderByDate({
        date: dayjs().toDate(),
      })

      let orderNumber = '0'

      if (ordersTotal > 99) {
        orderNumber = `${ordersTotal + 1}`
      } else if (ordersTotal > 9) {
        orderNumber = `0${ordersTotal + 1}`
      } else {
        orderNumber = `00${ordersTotal + 1}`
      }

      const data: OrderDto = {
        orderNo: dayjs().format(`OR-YYYYMMDD-${orderNumber}`),
        amount,
        discount,
        total,
        status: OrderStatus.waiting_payment,
        trackingNo: '',
        trackingCompanyName: '',
        transferSlipImageUrl: '',
        name: address.name,
        address: address.address,
        subDistrict: address.subDistrict,
        district: address.district,
        province: address.province,
        telephone: address.telephone,
        zipcode: address.zipcode,
        customer: req.user,
        orderItems,
        shippingFee: 0.0,
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
