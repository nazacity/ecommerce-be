import { Product } from 'src/modules/product/entity/product.entity'
import { GlobalEntity } from 'src/utils/global-entity'
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: `${process.env.ENV}_product_category`,
})
export class ProductCategory extends GlobalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  color: string

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[]
}
