import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { RequestClinicUserModel } from 'src/model/request.model'
import { ResponseModel } from 'src/model/response.model'
import { CustomerJwtAuthGuard } from '../auth/guard/customer-auth.guard'
import { CustomerService } from './customer.service'
import { Customer } from './entities/customer.entity'
import { CustomerCreateDto, CustomerUpdateDto } from './dto/customer.dto'
import { AuthTokenModel } from '../auth/model/auth-token.model'
import { JwtService } from '@nestjs/jwt'

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
  ) {}

  @ApiBearerAuth('Customer Authorization')
  @UseGuards(CustomerJwtAuthGuard)
  @Get('/info')
  async getCustomerByToken(
    @Request() req: RequestClinicUserModel,
  ): Promise<ResponseModel<Customer>> {
    try {
      return { data: req.user }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Get('/:customerId')
  async getCustomerById(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
  ): Promise<ResponseModel<Customer>> {
    try {
      const customer = await this.customerService.getCustomerById(customerId)

      return { data: customer }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @ApiBearerAuth('Customer Authorization')
  @UseGuards(CustomerJwtAuthGuard)
  @Get('/check-customer-by-recommentor-code/:recommentorCode')
  async getCheckCustomerByRecommentorCode(
    @Request() req: RequestClinicUserModel,
    @Param('recommentorCode') recommentorCode: string,
  ): Promise<ResponseModel<boolean>> {
    try {
      if (req.user.recommentorCode === recommentorCode) {
        return {
          data: false,
        }
      }

      const customer =
        await this.customerService.getCustomerByRecommentorCode(recommentorCode)

      return { data: !!customer }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Post()
  async createCustomer(
    @Body() customerCreateDto: CustomerCreateDto,
  ): Promise<ResponseModel<Customer>> {
    try {
      const createCustomer =
        await this.customerService.createCustomer(customerCreateDto)

      return { data: createCustomer }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Put()
  async putCustomer(@Body() customerCreateDto: CustomerCreateDto): Promise<
    ResponseModel<{
      token: AuthTokenModel
      user: Partial<Customer>
    }>
  > {
    try {
      const putCustomer =
        await this.customerService.putCustomer(customerCreateDto)

      const accessToken = await this.getNewToken({
        id: putCustomer.id,
      })

      return { data: { token: accessToken, user: putCustomer } }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  public async getNewToken(payload: any): Promise<AuthTokenModel> {
    const accessToken = await this.jwtService.signAsync(payload)

    return { accessToken } as AuthTokenModel
  }

  @ApiBearerAuth('Customer Authorization')
  @Patch('/:customerId')
  async updateCustomer(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
    @Body() customerUpdateDto: CustomerUpdateDto,
  ): Promise<ResponseModel<Customer>> {
    try {
      const updatedCustomer = await this.customerService.updateCustomer({
        id: customerId,
        customerUpdate: customerUpdateDto,
      })

      return { data: updatedCustomer }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      )
    }
  }

  @Delete('/:customerId')
  async deleteCustomer(
    @Param('customerId', new ParseUUIDPipe()) customerId: string,
  ): Promise<ResponseModel<string>> {
    try {
      const deletedCustomer = await this.customerService.deleteCustomer({
        customerId,
      })

      if (deletedCustomer) {
        return { data: 'succeeded' }
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
