import { Customer } from '../domain/entities/customer.entity';

export class CustomerResponseDto {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;

  static fromEntity(customer: Customer): CustomerResponseDto {
    const dto = new CustomerResponseDto();
    dto.id = customer.id;
    dto.fullName = customer.fullName;
    dto.email = customer.email;
    dto.phone = customer.phone;
    dto.address = customer.address;
    dto.city = customer.city;
    dto.zipCode = customer.zipCode;
    return dto;
  }
}