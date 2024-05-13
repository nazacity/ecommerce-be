import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { ScheduleModule } from '@nestjs/schedule'
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n'
import * as path from 'path'
import { AppConfigModule } from './modules/config/app'
import {
  ThrottleConfigModule,
  ThrottleConfigService,
} from './modules/config/throttle'
import { SqlConfigModule, SqlConfigService } from './modules/config/sql'
import { ThrottlerBehindProxyGuard } from './middlewares/throttler/throttler-behind-proxy.guard'
import { AuthModule } from './modules/auth/auth.module'
import { CustomerModule } from './modules/customer/customer.module'
import { AdminModule } from './modules/admin/admin.module'
import { R2Module } from './modules/r2/r2.module'
import { ProductModule } from './modules/product/product.module'
import { ProductOptionModule } from './modules/product-option/product-option.module'
import { ProductOptionDiscountModule } from './modules/product-option-discount/product-option-discount.module'
import { CartModule } from './modules/cart/cart.module'
import { CartItemModule } from './modules/cart-item/cart-item.module'
import { OrderModule } from './modules/order/order.module'
import { OrderItemModule } from './modules/order-item/order-item.module'
import { CustomerAddressModule } from './modules/customer-address/customer-address.module'
import { CustomerCreditModule } from './modules/customer-credit/customer-credit.module'
import { CustomerCreditHistoryModule } from './modules/customer-credit-history/customer-credit-history.module'
import { ProductCategoryModule } from './modules/product-category/product-category.module'
import { ProductImageModule } from './modules/product-image/product-image.module';

// Scheduler

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      resolvers: [AcceptLanguageResolver],
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [SqlConfigModule],
      useFactory: (sqlConfigService: SqlConfigService) => {
        return {
          type: 'postgres',
          host: sqlConfigService.host,
          port: sqlConfigService.port,
          username: sqlConfigService.username,
          password: sqlConfigService.password,
          database: sqlConfigService.database,
          synchronize: true,
          logging: sqlConfigService.logging,
          autoLoadEntities: true,
          entities: ['dist/**/*.entity.js'],
          // namingStrategy: new SnakeNamingStrategy(),
          useUTC: true,
          legacySpatialSupport: false,
        }
      },
      inject: [SqlConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ThrottleConfigModule],
      inject: [ThrottleConfigService],
      useFactory: (throttleConfigService: ThrottleConfigService) => [
        {
          ...throttleConfigService,
          ttl: throttleConfigService.throttleTtl,
          limit: throttleConfigService.throttleLimit,
        },
      ],
    }),
    ScheduleModule.forRoot(),
    CustomerModule,
    AdminModule,
    R2Module,
    ProductModule,
    ProductCategoryModule,
    ProductOptionModule,
    ProductOptionDiscountModule,
    CartModule,
    CartItemModule,
    OrderModule,
    OrderItemModule,
    CustomerAddressModule,
    CustomerCreditModule,
    CustomerCreditHistoryModule,
    ProductImageModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
