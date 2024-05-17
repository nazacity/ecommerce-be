import { Product } from 'src/modules/product/entity/product.entity'
import { GlobalEntity } from 'src/utils/global-entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: `${process.env.ENV}_product_image`,
})
export class ProductImage extends GlobalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ nullable: true })
  imageUrl: string

  @ManyToOne(() => Product, (product) => product.images, {
    createForeignKeyConstraints: true,
  })
  product: Product
}
