import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ProductService } from './product.service'
import { ProductImageService } from '../product-image/product-image.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import {
  ProductCreateDto,
  ProductDto,
  ProductQuery,
  ProductUpdateDto,
} from './dto/product.dto'
import { ResponseModel } from 'src/model/response.model'
import { Product } from './entity/product.entity'
import { ProductCategoryService } from '../product-category/product-category.service'
import { ProductOptionService } from '../product-option/product-option.service'

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productImageService: ProductImageService,
    private readonly productCategoryService: ProductCategoryService,
    private readonly productOptionService: ProductOptionService,
  ) {}

  @Get()
  async getProducts(
    @Query() query: ProductQuery,
  ): Promise<ResponseModel<Product[]>> {
    try {
      const { products, total } = await this.productService.getProducts(query)

      return {
        meta: {
          total,
        },
        data: products,
      }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Get('/:productId')
  async getProductById(
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ): Promise<ResponseModel<Product>> {
    try {
      const product = await this.productService.getProductById(productId)

      return { data: product }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @ApiBearerAuth('Admin Authorization')
  @Post()
  async creatProduct(
    @Body() productCreateDto: ProductCreateDto,
  ): Promise<ResponseModel<Product>> {
    try {
      const images = await Promise.all(
        productCreateDto.images.map((item) => {
          return this.productImageService.createProductImage({
            imageUrl: item,
          })
        }),
      )

      const categories = await Promise.all(
        productCreateDto.categoriesId.map((item) => {
          return this.productCategoryService.getProductCategoryById(item)
        }),
      )

      const productOptions = await Promise.all(
        productCreateDto.productOptions.map((item) => {
          return this.productOptionService.createProductOption(item)
        }),
      )

      const data: ProductDto = {
        thumbnailImageUrl: productCreateDto.thumbnailImageUrl,
        name: productCreateDto.name,
        description: productCreateDto.description,
        productOptions,
        images,
        categories,
      }

      const createProduct = await this.productService.createProduct(data)

      return { data: createProduct }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @ApiBearerAuth('Admin Authorization')
  @Patch('/:productId')
  async updateProduct(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() productUpdateDto: ProductUpdateDto,
  ): Promise<ResponseModel<Product>> {
    try {
      const product = await this.productService.getProductById(productId)

      if (product) {
        await Promise.all([
          product.images.map((item) => {
            return this.productImageService.deleteProductImage({
              productImageId: item.id,
            })
          }),
          product.productOptions.map((item) => {
            return this.productOptionService.deleteProductOption({
              productOptionId: item.id,
            })
          }),
        ])
      }

      const images = await Promise.all(
        productUpdateDto.images.map((item) => {
          return this.productImageService.createProductImage({
            imageUrl: item,
          })
        }),
      )

      const categories = await Promise.all(
        productUpdateDto.categoriesId.map((item) => {
          return this.productCategoryService.getProductCategoryById(item)
        }),
      )

      const productOptions = await Promise.all(
        productUpdateDto.productOptions.map((item) => {
          return this.productOptionService.createProductOption(item)
        }),
      )

      const data: ProductDto = {
        thumbnailImageUrl: productUpdateDto.thumbnailImageUrl,
        name: productUpdateDto.name,
        description: productUpdateDto.description,
        productOptions,
        images,
        categories,
      }

      const updateProduct = await this.productService.updateProduct({
        productId,
        productDto: data,
      })

      return { data: updateProduct }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @ApiBearerAuth('Admin Authorization')
  @Delete('/:productId')
  async deleteProduct(
    @Param('productId', new ParseUUIDPipe()) productId: string,
  ): Promise<ResponseModel<string>> {
    try {
      const deletedProduct = await this.productService.deleteProduct({
        productId,
      })

      if (deletedProduct) {
        return { data: 'succeeded' }
      }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }
}
