import { Customer } from 'src/modules/customer/entities/customer.entity'
import { GlobalEntity } from 'src/utils/global-entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
  name: `${process.env.ENV}_customer_address`,
})
export class CustomerAddress extends GlobalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column({ type: 'text' })
  address: string

  @Column()
  subDistrict: string

  @Column()
  district: string

  @Column()
  province: string

  @Column()
  telephone: string

  @Column()
  zipcode: string

  @ManyToOne(() => Customer, (customer) => customer.addresses, {
    createForeignKeyConstraints: true,
  })
  customer: Customer
}
