import { OrderStatus } from '../entity/order.entity'
import { Customer } from 'src/modules/customer/entities/customer.entity'
import { OrderItem } from 'src/modules/order-item/entity/order-item.entity'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator'
import { PaginationDto } from 'src/utils/pagination'
import { DateRangeDto } from 'src/utils/utils.dto'

export class OrderDto {
  orderNo: string
  amount: number
  discount: number
  total: number
  creditAmount: number
  status: OrderStatus
  trackingNo: string
  trackingCompanyName: string
  transferSlipImageUrl: string
  name: string
  address: string
  subDistrict: string
  district: string
  province: string
  telephone: string
  zipcode: string
  customer: Customer
  orderItems: OrderItem[]
  shippingFee: number
  recommentorCode: string
}

export class OrderCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  addressId: string

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  cartItemIds: string[]

  @ApiProperty()
  @IsString()
  recommentorCode: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  creditAmount: number
}

export class OrderUpdateShippingInformationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trackingNo: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  trackingCompanyName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  shippingFee: number
}

export class OrderUpdateTransferSlipImageUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  transferSlipImageUrl: string
}

export class OrderUpdateStatusDto {
  @ApiProperty({
    type: 'enum',
    enum: OrderStatus,
    required: false,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus
}

export class OrderQueryDto extends DateRangeDto {
  @ApiProperty({
    type: 'enum',
    enum: OrderStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus
}

export class OrderQueryByDateDto {
  date: Date
}

export class OrderQueryByUserDto extends PaginationDto {
  @ApiProperty({
    type: 'enum',
    enum: OrderStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus
}
