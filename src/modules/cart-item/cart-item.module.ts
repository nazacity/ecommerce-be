import { Module } from '@nestjs/common'
import { CartItemService } from './cart-item.service'
import { CartItemController } from './cart-item.controller'
import { CartItem } from './entity/cart-item.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductOptionModule } from '../product-option/product-option.module'

@Module({
  imports: [TypeOrmModule.forFeature([CartItem]), ProductOptionModule],
  controllers: [CartItemController],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
