export class OrderDto {
  orderId: number;
  itemName: string;
  quantity: number;
  price: number;
  total: number;

  constructor(order: Record<string, any>) {
    this.orderId = order.orderId;
    this.itemName = order.item_name;
    this.quantity = order.quantity;
    this.price = order.price;
    this.total = order.total;
  }
}
