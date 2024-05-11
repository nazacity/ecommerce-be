import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JwtConfigService } from '../../config/jwt'
import { CustomerService } from 'src/modules/customer/customer.service'

@Injectable()
export class CustomerJwtStrategy extends PassportStrategy(
  Strategy,
  'customerJwt',
) {
  constructor(
    private readonly jwtConfigService: JwtConfigService,
    private readonly customerService: CustomerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConfigService.secret,
    })
  }

  async validate(payload: any) {
    try {
      const userInfo = await this.customerService.getCustomerById(payload.id)

      return userInfo
    } catch (error) {
      throw new UnauthorizedException()
    }
  }
}
