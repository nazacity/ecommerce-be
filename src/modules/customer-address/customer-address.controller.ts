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
import { CustomerAddressService } from './customer-address.service'
import { CustomerJwtAuthGuard } from '../auth/guard/customer-auth.guard'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { ResponseModel } from 'src/model/response.model'
import { CustomerAddress } from './entities/customer-address.entity'
import { CustomerAddressDto } from './dto/customer-address.dto'
import { RequestClinicUserModel } from 'src/model/request.model'

@ApiTags('Customer Address')
@Controller('customer-address')
export class CustomerAddressController {
  constructor(
    private readonly customerAddressService: CustomerAddressService,
  ) {}

  @ApiBearerAuth('Customer Authorization')
  @UseGuards(CustomerJwtAuthGuard)
  @Get('/customer-address-by-token')
  async getCustomerAddressByToken(
    @Request() req: RequestClinicUserModel,
  ): Promise<ResponseModel<CustomerAddress[]>> {
    try {
      const { customerAddresses, total } =
        await this.customerAddressService.getCustomerAddressByUserId(
          req.user.id,
        )
      return {
        data: customerAddresses,
        meta: {
          total,
        },
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

  @Get('/:userAddressId')
  async getCustomerAddressById(
    @Param('userAddressId', new ParseUUIDPipe()) userAddressId: string,
  ): Promise<ResponseModel<CustomerAddress>> {
    try {
      const customerAddress =
        await this.customerAddressService.getCustomerAddressById(userAddressId)

      return { data: customerAddress }
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
  @Post()
  async createCustomerAddress(
    @Request() req: RequestClinicUserModel,
    @Body() customerAddressDto: CustomerAddressDto,
  ): Promise<ResponseModel<CustomerAddress>> {
    try {
      const createCustomerAddress =
        await this.customerAddressService.createCustomerAddress({
          ...customerAddressDto,
          customer: req.user,
        })

      return { data: createCustomerAddress }
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
  @Patch('/:userAddressId')
  async updateCustomerAddress(
    @Request() req: RequestClinicUserModel,
    @Param('userAddressId', new ParseUUIDPipe()) userAddressId: string,
    @Body() customerAddressDto: CustomerAddressDto,
  ): Promise<ResponseModel<CustomerAddress>> {
    try {
      const updatedCustomerAddress =
        await this.customerAddressService.updateCustomerAddress({
          userAddressId,
          customerAddressDto: {
            ...customerAddressDto,
            customer: req.user,
          },
        })

      return { data: updatedCustomerAddress }
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
  @Delete('/:userAddressId')
  async deleteCustomerAddress(
    @Param('userAddressId', new ParseUUIDPipe()) userAddressId: string,
  ): Promise<ResponseModel<string>> {
    try {
      const deletedCustomerAddress =
        await this.customerAddressService.deleteCustomerAddress({
          userAddressId,
        })

      if (deletedCustomerAddress) {
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
