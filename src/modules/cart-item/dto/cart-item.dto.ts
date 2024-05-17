import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { Cart } from 'src/modules/cart/entity/cart.entity'
import { ProductOption } from 'src/modules/product-option/entity/product-option.entity'

export class CartItemInsertDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  productOptionId: string
}

export class CartItemDto {
  quantity: number
  cart: Cart
  productOption: ProductOption
}
