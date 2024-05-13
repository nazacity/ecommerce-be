import { Module } from '@nestjs/common'
import { OrderItemService } from './order-item.service'
import { OrderItemController } from './order-item.controller'
import { OrderItem } from './entity/order-item.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  controllers: [OrderItemController],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}