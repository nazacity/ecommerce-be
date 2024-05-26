import { ApiProperty } from '@nestjs/swagger'
import { IsDateString, IsOptional } from 'class-validator'
import { PaginationDto } from './pagination'

export class DateRangeDto extends PaginationDto {
  @ApiProperty({
    default: new Date(),
  })
  @IsOptional()
  @IsDateString()
  from?: string

  @ApiProperty({
    default: new Date(),
  })
  @IsOptional()
  @IsDateString()
  to?: string
}
