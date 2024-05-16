import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/utils/pagination'

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
}
