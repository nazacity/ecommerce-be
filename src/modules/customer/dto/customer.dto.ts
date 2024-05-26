import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from 'src/utils/pagination'

export class CustomerCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  displayName: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  profileImageUrl: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lineId: string
}

export class CustomerUpdateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  displayName: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  profileImageUrl: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lineId: string
}

export class CustomerUpdateQueryDto extends PaginationDto {}
