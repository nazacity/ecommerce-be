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
  UseGuards,
} from '@nestjs/common'
import { ProductCategoryService } from './product-category.service'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ResponseModel } from 'src/model/response.model'
import { ProductCategory } from './entity/product-category.entity'
import {
  ProductCategoryDto,
  ProductCategoryQuery,
} from './dto/product-category.dto'
import { AdminJwtAuthGuard } from '../auth/guard/admin-auth.guard'

@ApiTags('Product Category')
@Controller('product-category')
export class ProductCategoryController {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Get()
  async getProducts(
    @Query() query: ProductCategoryQuery,
  ): Promise<ResponseModel<ProductCategory[]>> {
    try {
      const { productCategories, total } =
        await this.productCategoryService.getProductCategories(query)

      return {
        meta: {
          total,
        },
        data: productCategories,
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

  @Get('/:productCategoryId')
  async getProductById(
    @Param('productCategoryId', new ParseUUIDPipe()) productCategoryId: string,
  ): Promise<ResponseModel<ProductCategory>> {
    try {
      const productCategory =
        await this.productCategoryService.getProductCategoryById(
          productCategoryId,
        )

      return { data: productCategory }
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
  @UseGuards(AdminJwtAuthGuard)
  @Post()
  async creatProduct(
    @Body() productCategoryDto: ProductCategoryDto,
  ): Promise<ResponseModel<ProductCategory>> {
    try {
      const createProduct =
        await this.productCategoryService.createProductCategory(
          productCategoryDto,
        )

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
  @UseGuards(AdminJwtAuthGuard)
  @Patch('/:productCategoryId')
  async updateProductCategory(
    @Param('productCategoryId', new ParseUUIDPipe()) productCategoryId: string,
    @Body() productCategoryDto: ProductCategoryDto,
  ): Promise<ResponseModel<ProductCategory>> {
    try {
      const updateProduct =
        await this.productCategoryService.updateProductCategory({
          productCategoryId,
          productCategoryDto,
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
  @UseGuards(AdminJwtAuthGuard)
  @Delete('/:productCategoryId')
  async deleteProduct(
    @Param('productCategoryId', new ParseUUIDPipe()) productCategoryId: string,
  ): Promise<ResponseModel<string>> {
    try {
      const deletedProduct =
        await this.productCategoryService.deleteProductCategory({
          productCategoryId,
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
