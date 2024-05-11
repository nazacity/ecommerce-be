import { ApiProperty } from '@nestjs/swagger'
import { IsDateString } from 'class-validator'
import { PaginationDto } from './pagination'

export class DateRangeDto extends PaginationDto {
  @ApiProperty({
    default: new Date(),
  })
  @IsDateString()
  from: string

  @ApiProperty({
    default: new Date(),
  })
  @IsDateString()
  to: string
}
