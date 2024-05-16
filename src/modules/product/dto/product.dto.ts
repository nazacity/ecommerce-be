import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { ProductCategory } from 'src/modules/product-category/entity/product-category.entity'
import { ProductImage } from 'src/modules/product-image/entity/product-image.entity'
import { ProductOptionDto } from 'src/modules/product-option/dto/product-option.dto'
import { ProductOption } from 'src/modules/product-option/entity/product-option.entity'
import { PaginationDto } from 'src/utils/pagination'
import { ProductStatus } from '../entity/product.entity'

export class ProductCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  thumbnailImageUrl: string

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  images: string[]

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  productOptions: ProductOptionDto[]

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  categoriesId: string[]
}

export class ProductUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  thumbnailImageUrl: string

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  images: string[]

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  productOptions: ProductOptionDto[]

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  categoriesId: string[]

  @ApiProperty({ enum: ProductStatus })
  @IsEnum(ProductStatus)
  status: ProductStatus
}

export class ProductDto {
  thumbnailImageUrl: string
  images: ProductImage[]
  name: string
  description: string
  productOptions: ProductOption[]
  categories: ProductCategory[]
}

export class ProductQuery extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoriesId?: string[]
}
