import { Module } from '@nestjs/common'
import { ProductImageService } from './product-image.service'
import { ProductImageController } from './product-image.controller'
import { ProductImage } from './entity/product-image.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([ProductImage])],
  controllers: [ProductImageController],
  providers: [ProductImageService],
  exports: [ProductImageService],
})
export class ProductImageModule {}
