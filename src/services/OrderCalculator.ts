export class OrderCalculator {
  static readonly TAX_RATE = 0.05;
  static readonly DISCOUNT_THRESHOLDS = [
    { minAmount: 50000, rate: 0.15 },
    { minAmount: 25000, rate: 0.1 },
    { minAmount: 10000, rate: 0.075 },
    { minAmount: 5000, rate: 0.05 },
  ];

  static calculateSubtotal(
    items: { price: number; quantity: number }[]
  ): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  static calculateShippingCost(
    subtotal: number,
    shippingMethod: string
  ): number {
    if (shippingMethod === "Free") return 0;
    return subtotal > 10000
      ? shippingMethod === "Regular"
        ? 100
        : 50
      : shippingMethod === "Express"
      ? 200
      : 100;
  }

  static calculateDiscount(subtotal: number): number {
    for (const { minAmount, rate } of OrderCalculator.DISCOUNT_THRESHOLDS) {
      if (subtotal > minAmount) return subtotal * rate;
    }
    return 0;
  }

  static calculateTaxes(subtotal: number, discount: number): number {
    return (subtotal - discount) * OrderCalculator.TAX_RATE;
  }

  static getTotal(
    items: { price: number; quantity: number }[],
    shippingMethod: string
  ): {
    subtotal: number;
    discount: number;
    shippingCost: number;
    taxes: number;
    total: number;
  } {
    const subtotal = OrderCalculator.calculateSubtotal(items);
    const discount = OrderCalculator.calculateDiscount(subtotal);
    const shippingCost = OrderCalculator.calculateShippingCost(
      subtotal,
      shippingMethod
    );
    const taxes = OrderCalculator.calculateTaxes(subtotal, discount);
    const total = subtotal - discount + shippingCost + taxes;

    return { subtotal, discount, shippingCost, taxes, total };
  }
}
