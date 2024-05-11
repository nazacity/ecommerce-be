import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CustomerLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lineId: string
}
