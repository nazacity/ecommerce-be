import { CustomerCreditHistory } from 'src/modules/customer-credit-history/entity/customer-credit-history.entity'
import { Customer } from 'src/modules/customer/entities/customer.entity'
import { GlobalEntity } from 'src/utils/global-entity'
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({
  name: `${process.env.ENV}_customer_credit`,
})
export class CustomerCredit extends GlobalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  amount: number

  @OneToMany(
    () => CustomerCreditHistory,
    (customerCreditHistory) => customerCreditHistory.customerCredit,
    {
      createForeignKeyConstraints: false,
    },
  )
  histories: CustomerCreditHistory[]

  @OneToOne(() => Customer, (customer) => customer.credit, {
    createForeignKeyConstraints: true,
  })
  customer: Customer
}
