import { CartItem } from 'src/modules/cart-item/entity/cart-item.entity'
import { OrderItem } from 'src/modules/order-item/entity/order-item.entity'
import { ProductOptionDiscount } from 'src/modules/product-option-discount/entity/product-option-discount.entity'
import { Product } from 'src/modules/product/entity/product.entity'
import { GlobalEntity } from 'src/utils/global-entity'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity({
  name: `${process.env.ENV}_product_option`,
})
export class ProductOption extends GlobalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  label: string

  @Column()
  price: number

  @ManyToOne(() => Product, (product) => product.productOptions, {
    createForeignKeyConstraints: true,
  })
  product: Product

  @OneToMany(
    () => ProductOptionDiscount,
    (productOptionDiscount) => productOptionDiscount.productOption,
    {
      createForeignKeyConstraints: false,
    },
  )
  discounts: ProductOptionDiscount[]

  @OneToMany(() => CartItem, (cartItem) => cartItem.productOption, {
    createForeignKeyConstraints: false,
  })
  cartItems: CartItem[]

  @OneToMany(() => OrderItem, (orderItem) => orderItem.productOption, {
    createForeignKeyConstraints: false,
  })
  orderItems: OrderItem[]
}
