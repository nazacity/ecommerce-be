import { Controller } from '@nestjs/common';
import { CustomerCreditService } from './customer-credit.service';

@Controller('customer-credit')
export class CustomerCreditController {
  constructor(private readonly customerCreditService: CustomerCreditService) {}
}
