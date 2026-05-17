import { Customer } from '../entities/customer.entity';

export interface CreateCustomerData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface CustomerRepositoryPort {
  create(data: CreateCustomerData): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
}

export const CUSTOMER_REPOSITORY = 'CUSTOMER_REPOSITORY';