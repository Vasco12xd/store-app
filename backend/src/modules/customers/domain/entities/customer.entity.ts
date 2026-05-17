export class Customer {
  constructor(
    public readonly id: string,
    public readonly fullName: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly address: string,
    public readonly city: string,
    public readonly zipCode: string,
    public readonly createdAt: Date,
  ) {}
}