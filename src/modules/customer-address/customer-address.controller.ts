import { Controller } from '@nestjs/common';
import { CustomerAddressService } from './customer-address.service';

@Controller('customer-address')
export class CustomerAddressController {
  constructor(private readonly customerAddressService: CustomerAddressService) {}
}
