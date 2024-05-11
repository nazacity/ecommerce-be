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

@ApiTags('Customer')
@Controller('Customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

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
      const Customer = await this.customerService.getCustomerById(customerId)

      return { data: Customer }
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
  async creatCustomer(
    @Body() customerCreateDto: CustomerCreateDto,
  ): Promise<ResponseModel<Customer>> {
    try {
      const createCustomer = await this.customerService.createCustomer(
        customerCreateDto,
      )

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

  @ApiBearerAuth('Customer Authorization')
  @Patch('/:customerId')
  async updateob(
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
    @Param('customerId', new ParseUUIDPipe()) CustomerId: string,
  ): Promise<ResponseModel<string>> {
    try {
      const deletedCustomer = await this.customerService.deleteCustomer(
        CustomerId,
      )

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
