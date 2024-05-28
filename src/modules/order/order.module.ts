import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from './entity/order.entity'
import { OrderItemModule } from '../order-item/order-item.module'
import { CustomerAddressModule } from '../customer-address/customer-address.module'
import { CartItemModule } from '../cart-item/cart-item.module'
import { CustomerCreditModule } from '../customer-credit/customer-credit.module'
import { CustomerCreditHistoryModule } from '../customer-credit-history/customer-credit-history.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    OrderItemModule,
    CustomerCreditModule,
    CustomerCreditHistoryModule,
    CustomerAddressModule,
    CartItemModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
