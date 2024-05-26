import { CustomerAddress } from 'src/modules/customer-address/entities/customer-address.entity'
import { Customer } from 'src/modules/customer/entities/customer.entity'
import { OrderItem } from 'src/modules/order-item/entity/order-item.entity'
import { GlobalEntity } from 'src/utils/global-entity'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum OrderStatus {
  'waiting_payment' = 'waiting_payment',
  'waiting_checking' = 'waiting_checking',
  'waiting_send' = 'waiting_send',
  'sent' = 'sent',
  'cancaled' = 'cancaled',
}

@Entity({
  name: `${process.env.ENV}_order`,
})
export class Order extends GlobalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  amount: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  discount: number

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  total: number

  @Column({
    enum: OrderStatus,
    default: OrderStatus.waiting_payment,
  })
  status: OrderStatus

  @Column({ default: '', nullable: true })
  trackingNo: string

  @Column({ default: '', nullable: true })
  trackingCompanyName: string

  @Column({ default: '', nullable: true })
  transferSlipImageUrl: string

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    createForeignKeyConstraints: true,
  })
  address: CustomerAddress

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    createForeignKeyConstraints: true,
  })
  customer: Customer

  @OneToMany(() => OrderItem, (OrderItem) => OrderItem.order, {
    createForeignKeyConstraints: false,
  })
  orderItems: OrderItem[]
}
