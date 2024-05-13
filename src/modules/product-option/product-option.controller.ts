import { Controller } from '@nestjs/common';
import { ProductOptionService } from './product-option.service';

@Controller('product-option')
export class ProductOptionController {
  constructor(private readonly productOptionService: ProductOptionService) {}
}
