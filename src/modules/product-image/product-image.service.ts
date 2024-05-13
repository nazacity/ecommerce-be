import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductImage } from './entity/product-image.entity'
import { Repository } from 'typeorm'
import { ProductImageDto } from './dto/product-image.dto'

@Injectable()
export class ProductImageService {
  private readonly logger = new Logger(ProductImageService.name)
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async createProductImage(
    productImageDto: ProductImageDto,
  ): Promise<ProductImage> {
    try {
      this.logger.log('create-product-image')
      const createdProduct =
        await this.productImageRepository.create(productImageDto)

      const savedProduct =
        await this.productImageRepository.save(createdProduct)

      return savedProduct
    } catch (error) {
      throw error
    }
  }

  async deleteProductImage({
    productImageId,
  }: {
    productImageId: string
  }): Promise<boolean> {
    try {
      this.logger.log('delete-product-image')

      await this.productImageRepository.delete(productImageId)

      return true
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }
}
