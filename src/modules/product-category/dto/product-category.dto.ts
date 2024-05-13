import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { PaginationDto } from 'src/utils/pagination'

export class ProductCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  color: string
}

export class ProductCategoryQuery extends PaginationDto {}
