import { Module } from '@nestjs/common'
import { ProductOptionDiscountService } from './product-option-discount.service'
import { ProductOptionDiscountController } from './product-option-discount.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductOptionDiscount } from './entity/product-option-discount.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ProductOptionDiscount])],
  controllers: [ProductOptionDiscountController],
  providers: [ProductOptionDiscountService],
  exports: [ProductOptionDiscountService],
})
export class ProductOptionDiscountModule {}
