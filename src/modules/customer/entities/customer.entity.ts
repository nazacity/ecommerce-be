import { Cart } from 'src/modules/cart/entity/cart.entity'
import { CustomerAddress } from 'src/modules/customer-address/entities/customer-address.entity'
import { CustomerCredit } from 'src/modules/customer-credit/entities/customer-credit.entity'
import { Order } from 'src/modules/order/entity/order.entity'
import { GlobalEntity } from 'src/utils/global-entity'
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum CustomerStatus {
  'active' = 'active',
  'banned' = 'banned',
}

@Entity({
  name: `${process.env.ENV}_customer`,
})
export class Customer extends GlobalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  lineId: string

  @Column({ nullable: true, default: '' })
  displayName: string

  @Column({ nullable: true, default: '' })
  profileImageUrl: string

  @Column({ unique: true })
  recommentorCode: string

  @Column({
    default: CustomerStatus.active,
    type: 'enum',
    enum: CustomerStatus,
  })
  status: CustomerStatus

  @OneToOne(() => CustomerCredit, (customerCredit) => customerCredit.customer, {
    createForeignKeyConstraints: true,
  })
  @JoinColumn()
  credit: CustomerCredit

  @OneToOne(() => Cart, (cart) => cart.customer, {
    createForeignKeyConstraints: true,
  })
  @JoinColumn()
  cart: Cart

  @OneToMany(
    () => CustomerAddress,
    (customerAddress) => customerAddress.customer,
    {
      createForeignKeyConstraints: false,
    },
  )
  addresses: CustomerAddress[]

  @OneToMany(() => Order, (order) => order.customer, {
    createForeignKeyConstraints: false,
  })
  orders: Order[]
}
