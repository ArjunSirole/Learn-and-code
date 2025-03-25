export class OrderDTO {
  constructor(
    public orderId: number,
    public items: { itemName: string; quantity: number; price: number }[],
    public total: number
  ) {}
}
