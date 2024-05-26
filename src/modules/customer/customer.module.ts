import { Module } from '@nestjs/common'
import { CustomerService } from './customer.service'
import { CustomerController } from './customer.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Customer } from './entities/customer.entity'
import { CartModule } from '../cart/cart.module'
import { CustomerCreditModule } from '../customer-credit/customer-credit.module'
import { JwtModule } from '@nestjs/jwt'
import { JwtConfigModule, JwtConfigService } from '../config/jwt'

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    CartModule,
    CustomerCreditModule,
    JwtModule.registerAsync({
      imports: [JwtConfigModule],
      inject: [JwtConfigService],
      useFactory: async (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.secret,
      }),
    }),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
