import { GlobalEntity } from 'src/utils/global-entity'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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

  @Column()
  displayName: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ nullable: true, default: '' })
  profileImageUrl: string

  @Column({
    default: CustomerStatus.active,
    type: 'enum',
    enum: CustomerStatus,
  })
  status: CustomerStatus
}
