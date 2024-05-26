import { Order } from 'src/modules/order/entity/order.entity'
import { ProductOption } from 'src/modules/product-option/entity/product-option.entity'
import { GlobalEntity } from 'src/utils/global-entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: `${process.env.ENV}_order_item`,
})
export class OrderItem extends GlobalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  quantity: number

  @Column()
  discount: number

  @Column()
  total: number

  @ManyToOne(() => Order, (order) => order.orderItems, {
    createForeignKeyConstraints: true,
  })
  order: Order

  @ManyToOne(() => ProductOption, (productOption) => productOption.orderItems)
  productOption: ProductOption
}
