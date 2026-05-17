export enum DeliveryStatus {
  ASSIGNED = 'ASSIGNED',
  DISPATCHED = 'DISPATCHED',
  DELIVERED = 'DELIVERED',
}

export class Delivery {
  constructor(
    public readonly id: string,
    public readonly transactionId: string,
    public readonly customerId: string,
    public readonly productId: string,
    public readonly status: DeliveryStatus,
    public readonly address: string,
    public readonly city: string,
    public readonly zipCode: string,
    public readonly assignedAt: Date,
    public readonly updatedAt: Date,
  ) {}
}