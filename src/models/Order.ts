export class Order {
  private static readonly TAX_RATE = 0.05;
  private static readonly DISCOUNT_THRESHOLDS = [
    { minAmount: 50000, rate: 0.15 },
    { minAmount: 25000, rate: 0.1 },
    { minAmount: 10000, rate: 0.075 },
    { minAmount: 5000, rate: 0.05 },
  ];

  constructor(
    public itemName: string,
    public quantity: number,
    public price: number,
    public shippingMethod: string,
    public paymentMethod: string
  ) {}

  private calculateShippingCost(): number {
    if (this.shippingMethod === "Free") return 0;

    return this.price * this.quantity > 10000
      ? this.shippingMethod === "Express"
        ? 100
        : 50
      : this.shippingMethod === "Express"
      ? 200
      : 100;
  }

  private calculateDiscount(): number {
    const subtotal = this.price * this.quantity;
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
    const subtotal = this.price * this.quantity;
    const discount = this.calculateDiscount();
    const shippingCost = this.calculateShippingCost();
    const taxes = this.calculateTaxes(subtotal, discount);
    const total = subtotal - discount + shippingCost + taxes;

    return { subtotal, discount, shippingCost, taxes, total };
  }
}
