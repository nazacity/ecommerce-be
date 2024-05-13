import { CartItem } from 'src/modules/cart-item/entity/cart-item.entity'
import { Customer } from 'src/modules/customer/entities/customer.entity'
import { GlobalEntity } from 'src/utils/global-entity'
import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: `${process.env.ENV}_cart`,
})
export class Cart extends GlobalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToOne(() => Customer, (customer) => customer.cart, {
    createForeignKeyConstraints: true,
  })
  customer: Customer

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    createForeignKeyConstraints: false,
  })
  cartItemLists: CartItem[]
}
