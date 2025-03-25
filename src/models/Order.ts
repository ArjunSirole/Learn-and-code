export class Order {
  private static readonly TAX_RATE = 0.05;
  private static readonly DISCOUNT_THRESHOLDS = [
    { minAmount: 50000, rate: 0.15 },
    { minAmount: 25000, rate: 0.1 },
    { minAmount: 10000, rate: 0.075 },
    { minAmount: 5000, rate: 0.05 },
  ];

  constructor(
    public orderId: number | null,
    public items: { itemName: string; quantity: number; price: number }[],
    public shippingMethod: string,
    public paymentMethod: string
  ) {}

  private calculateSubtotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  private calculateShippingCost(): number {
    const subtotal = this.calculateSubtotal();
    if (this.shippingMethod === "Free") return 0;

    return subtotal > 10000
      ? this.shippingMethod === "Regular"
        ? 100
        : 50
      : this.shippingMethod === "Express"
      ? 200
      : 100;
  }

  private calculateDiscount(): number {
    const subtotal = this.calculateSubtotal();
    for (const { minAmount, rate } of Order.DISCOUNT_THRESHOLDS) {
      if (subtotal > minAmount) return subtotal * rate;
    }
    return 0;
  }

  private calculateTaxes(subtotal: number, discount: number): number {
    return (subtotal - discount) * Order.TAX_RATE;
  }

  public getTotal(): {
    subtotal: number;
    discount: number;
    shippingCost: number;
    taxes: number;
    total: number;
  } {
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount();
    const shippingCost = this.calculateShippingCost();
    const taxes = this.calculateTaxes(subtotal, discount);
    const total = subtotal - discount + shippingCost + taxes;

    return { subtotal, discount, shippingCost, taxes, total };
  }
}
