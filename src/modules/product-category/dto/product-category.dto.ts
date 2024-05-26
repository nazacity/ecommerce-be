import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { PaginationDto } from 'src/utils/pagination'

export class ProductCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  color: string

  @ApiProperty()
  @IsString()
  thumbnailImageUrl: string
}

export class ProductCategoryQuery extends PaginationDto {}
