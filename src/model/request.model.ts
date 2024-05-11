import { Admin } from 'src/modules/admin/entities/admin.entity'
import { Customer } from 'src/modules/customer/entities/customer.entity'

export class RequestClinicUserModel {
  user: Customer
}

export class RequestAdminUserModel {
  user: Admin
}
