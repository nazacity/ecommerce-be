import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class CustomerJwtAuthGuard extends AuthGuard('customerJwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }
    return user
  }
}
