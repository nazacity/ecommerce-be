import { Module } from '@nestjs/common'
import { ProductOptionService } from './product-option.service'
import { ProductOptionController } from './product-option.controller'
import { ProductOption } from './entity/product-option.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductOptionDiscount } from '../product-option-discount/entity/product-option-discount.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ProductOption, ProductOptionDiscount])],
  controllers: [ProductOptionController],
  providers: [ProductOptionService],
  exports: [ProductOptionService],
})
export class ProductOptionModule {}
