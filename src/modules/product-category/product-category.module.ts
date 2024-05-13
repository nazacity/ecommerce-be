import { Module } from '@nestjs/common'
import { ProductCategoryService } from './product-category.service'
import { ProductCategoryController } from './product-category.controller'
import { ProductCategory } from './entity/product-category.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  controllers: [ProductCategoryController],
  providers: [ProductCategoryService],
  exports: [ProductCategoryService],
})
export class ProductCategoryModule {}
