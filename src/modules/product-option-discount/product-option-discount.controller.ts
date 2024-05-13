import { Controller } from '@nestjs/common';
import { ProductOptionDiscountService } from './product-option-discount.service';

@Controller('product-option-discount')
export class ProductOptionDiscountController {
  constructor(private readonly productOptionDiscountService: ProductOptionDiscountService) {}
}
