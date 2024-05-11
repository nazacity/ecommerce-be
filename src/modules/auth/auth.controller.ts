import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { ApiTags } from '@nestjs/swagger'
import { AdminLoginDto } from './dto/admin-login.dto'
import { ResponseModel } from 'src/model/response.model'
import { CustomerService } from '../customer/customer.service'
import { AdminService } from '../admin/admin.service'
import { CustomerLoginDto } from './dto/customer-login.dto copy'
import { Admin } from '../admin/entities/admin.entity'
import { AuthTokenModel } from './model/auth-token.model'
import { Customer } from '../customer/entities/customer.entity'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
    private readonly administorService: AdminService,
  ) {}

  @Post('/customer/sign-in')
  async authenticationClinicAdministor(
    @Body() customerLoginDto: CustomerLoginDto,
  ): Promise<
    ResponseModel<{
      token: AuthTokenModel
      user: Partial<Customer>
    }>
  > {
    try {
      const customer = await this.customerService.getCustomerByLineId(
        customerLoginDto.lineId,
      )

      const accessToken = await this.authService.getNewToken({
        id: customer.id,
      })
      return {
        data: { token: accessToken, user: customer },
      }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Post('/admin/sign-in')
  async authenticationAdmin(
    @Body() adminLoginDto: AdminLoginDto,
  ): Promise<ResponseModel<{ token: AuthTokenModel; user: Partial<Admin> }>> {
    try {
      adminLoginDto.username = adminLoginDto.username.toLowerCase()
      const admin = await this.administorService.getAdminByUsernameAndPassword(
        adminLoginDto,
      )

      const accessToken = await this.authService.getNewToken({
        id: admin.id,
      })

      delete admin.username
      delete admin.password

      return {
        data: { token: accessToken, user: admin },
      }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }
}
