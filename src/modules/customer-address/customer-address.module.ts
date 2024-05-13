import { Module } from '@nestjs/common'
import { CustomerAddressService } from './customer-address.service'
import { CustomerAddressController } from './customer-address.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomerAddress } from './entities/customer-address.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CustomerAddress])],
  controllers: [CustomerAddressController],
  providers: [CustomerAddressService],
  exports: [CustomerAddressService],
})
export class CustomerAddressModule {}
