import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Product } from './entity/product.entity'
import { ILike, In, Repository } from 'typeorm'
import { paginationUtil } from 'src/utils/pagination'
import { ProductDto, ProductQuery } from './dto/product.dto'

const relations = ['categories', 'images', 'productOptions.discounts']

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProductById(productId: string): Promise<Product> {
    try {
      if (!productId) throw new Error('Invalid Product Id')
      const sysLegacyNofication = await this.productRepository.findOne({
        where: { id: productId },
        relations,
      })

      return sysLegacyNofication
    } catch (error) {
      throw error
    }
  }

  async getProducts(
    query: ProductQuery,
  ): Promise<{ products: Product[]; total: number }> {
    try {
      const { take, skip } = paginationUtil(query)
      const [products, total] = await this.productRepository.findAndCount({
        where: {
          ...(query.categoriesId &&
            query.categoriesId.length > 0 && {
              categories: {
                id: In(query.categoriesId),
                isDeleted: false,
              },
            }),
          ...(query.searchText && { name: ILike(`%${query.searchText}%`) }),
          isDeleted: false,
        },
        order: {
          createdAt: 'DESC',
        },
        take,
        skip,
        relations,
      })

      return { products, total }
    } catch (error) {
      throw error
    }
  }

  async createProduct(productDto: ProductDto): Promise<Product> {
    try {
      const createdProduct = await this.productRepository.create(productDto)

      const savedProduct = await this.productRepository.save(createdProduct)

      return savedProduct
    } catch (error) {
      throw error
    }
  }

  async updateProduct({
    productId,
    productDto,
  }: {
    productId: string
    productDto: ProductDto
  }): Promise<Product> {
    try {
      const product = await this.getProductById(productId)

      if (!product) throw new Error('Product is not found')

      const updateProduct = {
        ...product,
        ...productDto,
      }

      const updatedProduct = await this.productRepository.save(updateProduct)

      return updatedProduct
    } catch (error) {
      throw error
    }
  }

  async deleteProduct({ productId }: { productId: string }): Promise<boolean> {
    try {
      const product = await this.getProductById(productId)

      if (!product) throw new Error('Product is not found')

      const updatedProduct = {
        ...product,
        isDeleted: true,
      }

      await this.productRepository.save(updatedProduct)

      return true
    } catch (error) {
      throw error
    }
  }
}
