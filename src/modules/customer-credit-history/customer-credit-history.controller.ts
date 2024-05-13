import { Controller } from '@nestjs/common';
import { CustomerCreditHistoryService } from './customer-credit-history.service';

@Controller('customer-credit-history')
export class CustomerCreditHistoryController {
  constructor(private readonly customerCreditHistoryService: CustomerCreditHistoryService) {}
}
