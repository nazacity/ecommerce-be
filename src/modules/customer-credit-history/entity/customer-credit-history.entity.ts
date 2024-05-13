import { CustomerCredit } from 'src/modules/customer-credit/entities/customer-credit.entity'
import { GlobalEntity } from 'src/utils/global-entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

export enum CustomerCreditHistoryType {
  'increase' = 'increase',
  'decrease' = 'decrease',
}

@Entity({
  name: `${process.env.ENV}_customer_credit_history`,
})
export class CustomerCreditHistory extends GlobalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  amount: number

  @Column({ type: 'text' })
  description: string

  @Column({
    default: CustomerCreditHistoryType.increase,
    type: 'enum',
    enum: CustomerCreditHistoryType,
  })
  type: CustomerCreditHistoryType

  @ManyToOne(
    () => CustomerCredit,
    (customerCredit) => customerCredit.histories,
    {
      createForeignKeyConstraints: true,
    },
  )
  customerCredit: CustomerCredit
}
