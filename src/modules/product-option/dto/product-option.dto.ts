import { ProductOptionDiscountDto } from 'src/modules/product-option-discount/dto/product-option-discount.dto'

export class ProductOptionDto {
  id?: string
  label: string
  price: number
  cost: number
  discounts: ProductOptionDiscountDto[]
  index: number
}
