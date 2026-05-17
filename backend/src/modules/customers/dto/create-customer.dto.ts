import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  fullName: string;

  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @Matches(/^\+?[\d\s\-]{7,15}$/, { message: 'El teléfono no es válido' })
  phone: string;

  @IsNotEmpty({ message: 'La dirección es requerida' })
  @IsString()
  address: string;

  @IsNotEmpty({ message: 'La ciudad es requerida' })
  @IsString()
  city: string;

  @IsNotEmpty({ message: 'El código postal es requerido' })
  @Length(4, 10)
  zipCode: string;
}   