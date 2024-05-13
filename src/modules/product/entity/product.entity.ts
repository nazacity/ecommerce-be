import { ProductCategory } from 'src/modules/product-category/entity/product-category.entity'
import { ProductImage } from 'src/modules/product-image/entity/product-image.entity'
import { ProductOption } from 'src/modules/product-option/entity/product-option.entity'
import { GlobalEntity } from 'src/utils/global-entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum ProductStatus {
  'available' = 'available',
  'unavailable' = 'unavailable',
}

@Entity({
  name: `${process.env.ENV}_product`,
})
export class Product extends GlobalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  thumbnailImageUrl: string

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    createForeignKeyConstraints: false,
  })
  images: ProductImage[]

  @Column()
  name: string

  @Column({ type: 'text' })
  description: string

  @OneToMany(() => ProductOption, (productOption) => productOption.product, {
    createForeignKeyConstraints: false,
  })
  productOptions: ProductOption[]

  @ManyToMany(
    () => ProductCategory,
    (productCategory) => productCategory.products,
  )
  @JoinTable()
  categories: ProductCategory[]

  @Column({
    default: ProductStatus.available,
    type: 'enum',
    enum: ProductStatus,
  })
  status: ProductStatus
}
