import { Injectable, Logger } from '@nestjs/common'
import { ProductOption } from './entity/product-option.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProductOptionDto } from './dto/product-option.dto'
import { ProductOptionDiscount } from '../product-option-discount/entity/product-option-discount.entity'

const relations = ['discounts']

@Injectable()
export class ProductOptionService {
  private readonly logger = new Logger(ProductOptionService.name)
  constructor(
    @InjectRepository(ProductOption)
    private readonly productOptionRepository: Repository<ProductOption>,
    @InjectRepository(ProductOptionDiscount)
    private readonly productOptionDiscountRepository: Repository<ProductOptionDiscount>,
  ) {}

  async getProductOptionById(productOptionId: string): Promise<ProductOption> {
    this.logger.log('get-product-option-by-id')
    try {
      const productOption = await this.productOptionRepository.findOne({
        where: { id: productOptionId, isDeleted: false },
        relations,
      })

      return productOption
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }

  async createProductOption(
    productOptionProductOptionDto: ProductOptionDto,
  ): Promise<ProductOption> {
    try {
      this.logger.log('create-product-option')

      const discounts = await Promise.all(
        productOptionProductOptionDto.discounts.map(async (item) => {
          this.logger.log('create-product-option-discount')
          const createdProductDiscount =
            await this.productOptionDiscountRepository.create({
              quantity: item.quantity,
              discount: item.discount,
            })
          return this.productOptionDiscountRepository.save(
            createdProductDiscount,
          )
        }),
      )
      const createdProduct = await this.productOptionRepository.create({
        ...productOptionProductOptionDto,
        discounts,
      })

      const savedProduct =
        await this.productOptionRepository.save(createdProduct)

      return savedProduct
    } catch (error) {
      throw error
    }
  }

  async deleteProductOption({
    productOptionId,
  }: {
    productOptionId: string
  }): Promise<boolean> {
    try {
      this.logger.log('delete-product-option')
      const productOption = await this.getProductOptionById(productOptionId)

      await Promise.all(
        productOption.discounts.map((item) => {
          return this.productOptionDiscountRepository.delete(item.id)
        }),
      )

      await this.productOptionRepository.delete(productOptionId)

      return true
    } catch (error) {
      this.logger.debug(error)
      throw new Error(error)
    }
  }
}
