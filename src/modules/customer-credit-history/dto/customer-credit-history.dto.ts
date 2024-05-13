import { CustomerCreditHistoryType } from '../entity/customer-credit-history.entity'
import { CustomerCredit } from 'src/modules/customer-credit/entities/customer-credit.entity'

export class CustomerCreateHistoryDto {
  amount: number
  description: string
  type: CustomerCreditHistoryType
  customerCredit: CustomerCredit
}
