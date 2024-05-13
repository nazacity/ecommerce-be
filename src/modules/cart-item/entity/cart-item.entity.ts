import { Cart } from 'src/modules/cart/entity/cart.entity'
import { ProductOption } from 'src/modules/product-option/entity/product-option.entity'
import { GlobalEntity } from 'src/utils/global-entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: `${process.env.ENV}_cart_item`,
})
export class CartItem extends GlobalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  quantity: number

  @ManyToOne(() => Cart, (cart) => cart.cartItemLists, {
    createForeignKeyConstraints: true,
  })
  cart: Cart

  @ManyToOne(() => ProductOption, (productOption) => productOption.cartItems)
  productOption: ProductOption
}
