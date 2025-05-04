import { OrderCalculator } from "../services/OrderCalculator";

export class Order {
  constructor(
    public orderId: number | null,
    public items: { itemName: string; quantity: number; price: number }[],
    public shippingMethod: string,
    public paymentMethod: string
  ) {}

  public getTotal(): {
    subtotal: number;
    discount: number;
    shippingCost: number;
    taxes: number;
    total: number;
  } {
    return OrderCalculator.getTotal(this.items, this.shippingMethod);
  }
}
