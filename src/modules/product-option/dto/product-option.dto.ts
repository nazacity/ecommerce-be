import { ProductOptionDiscountDto } from 'src/modules/product-option-discount/dto/product-option-discount.dto'

export class ProductOptionDto {
  label: string
  price: number
  cost: number
  discounts: ProductOptionDiscountDto[]
}
