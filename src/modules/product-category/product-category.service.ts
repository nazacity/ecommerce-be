import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ProductCategory } from './entity/product-category.entity'
import { Repository } from 'typeorm'
import {
  ProductCategoryDto,
  ProductCategoryQuery,
} from './dto/product-category.dto'
import { paginationUtil } from 'src/utils/pagination'

const relations = ['products.productOptions']

@Injectable()
export class ProductCategoryService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) {}

  async getProductCategoryById(
    productCategoryId: string,
  ): Promise<ProductCategory> {
    try {
      if (!productCategoryId) throw new Error('Invalid Product Category Id')
      const sysLegacyNofication = await this.productCategoryRepository.findOne({
        where: { id: productCategoryId },
        relations,
      })

      return sysLegacyNofication
    } catch (error) {
      throw error
    }
  }

  async getProductCategories(query: ProductCategoryQuery): Promise<{
    productCategories: ProductCategory[]
    total: number
  }> {
    try {
      const { take, skip } = paginationUtil(query)
      const [productCategories, total] =
        await this.productCategoryRepository.findAndCount({
          where: {
            isDeleted: false,
          },
          order: {
            createdAt: 'DESC',
          },
          take,
          skip,
          relations,
        })

      return { productCategories, total }
    } catch (error) {
      throw error
    }
  }

  async createProductCategory(
    productCategoryDto: ProductCategoryDto,
  ): Promise<ProductCategory> {
    try {
      const createdProductCategory =
        await this.productCategoryRepository.create(productCategoryDto)

      const savedProductCategory = await this.productCategoryRepository.save(
        createdProductCategory,
      )

      return savedProductCategory
    } catch (error) {
      throw error
    }
  }

  async updateProductCategory({
    productCategoryId,
    productCategoryDto,
  }: {
    productCategoryId: string
    productCategoryDto: ProductCategoryDto
  }): Promise<ProductCategory> {
    try {
      const productCategory =
        await this.getProductCategoryById(productCategoryId)

      if (!productCategory) throw new Error('Product Category is not found')

      const updateProductCategory = {
        ...productCategory,
        ...productCategoryDto,
      }

      const updatedProductCategory = await this.productCategoryRepository.save(
        updateProductCategory,
      )

      return updatedProductCategory
    } catch (error) {
      throw error
    }
  }

  async deleteProductCategory({
    productCategoryId,
  }: {
    productCategoryId: string
  }): Promise<boolean> {
    try {
      const productCategory =
        await this.getProductCategoryById(productCategoryId)

      if (!productCategory) throw new Error('Product Category is not found')

      const updatedProductCategory = {
        ...productCategory,
        isDeleted: true,
      }

      await this.productCategoryRepository.save(updatedProductCategory)

      return true
    } catch (error) {
      throw error
    }
  }
}
