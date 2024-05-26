import { CustomerAddress } from 'src/modules/customer-address/entities/customer-address.entity'
import { OrderStatus } from '../entity/order.entity'
import { Customer } from 'src/modules/customer/entities/customer.entity'
import { OrderItem } from 'src/modules/order-item/entity/order-item.entity'

export class OrderDto {
  amount: number
  discount: number
  total: number
  status: OrderStatus
  trackingNo: string
  trackingCompanyName: string
  transferSlipImageUrl: string
  address: CustomerAddress
  customer: Customer
  orderItems: OrderItem[]
}

export class OrderCreateDto {
  addressId: string
  cartItemIds: string[]
}
