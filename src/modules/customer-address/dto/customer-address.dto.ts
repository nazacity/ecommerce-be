import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import { Customer } from 'src/modules/customer/entities/customer.entity'

export class CustomerAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subDistrict: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  district: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  province: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  telephone: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  zipcode: string

  customer: Customer
}
