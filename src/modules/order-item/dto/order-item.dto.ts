import { ProductOption } from 'src/modules/product-option/entity/product-option.entity'

export class OrderItemDto {
  quantity: number
  discount: number
  total: number
  productOption: ProductOption
}
