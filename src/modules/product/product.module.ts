import { Module } from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductController } from './product.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from './entity/product.entity'
import { ProductImageModule } from '../product-image/product-image.module'
import { ProductCategoryModule } from '../product-category/product-category.module'
import { ProductOptionModule } from '../product-option/product-option.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ProductImageModule,
    ProductCategoryModule,
    ProductOptionModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
