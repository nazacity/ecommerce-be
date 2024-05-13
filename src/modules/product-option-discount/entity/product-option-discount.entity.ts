import { ProductOption } from 'src/modules/product-option/entity/product-option.entity'
import { GlobalEntity } from 'src/utils/global-entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: `${process.env.ENV}_product_option_discount`,
})
export class ProductOptionDiscount extends GlobalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  quantity: number

  @Column()
  discount: number

  @ManyToOne(() => ProductOption, (productOption) => productOption.discounts, {
    createForeignKeyConstraints: true,
  })
  productOption: ProductOption
}
