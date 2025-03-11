export class OrderService {
  static calculateShippingCost(
    shipping_method: string,
    price: number,
    quantity: number
  ): number {
    if (shipping_method === "Free") return 0;
    if (price * quantity > 10000) {
      return shipping_method === "Express" ? 100 : 50;
    }
    return shipping_method === "Express" ? 200 : 100;
  }

  static calculateDiscount(price: number, quantity: number): number {
    const subtotal = price * quantity;
    if (subtotal > 50000) return subtotal * 0.15;
    if (subtotal > 25000) return subtotal * 0.1;
    if (subtotal > 10000) return subtotal * 0.075;
    if (subtotal > 5000) return subtotal * 0.05;
    return 0;
  }

  static calculateTaxes(subtotal: number, discount: number): number {
    return (subtotal - discount) * 0.05;
  }

  static computeOrderSummary(
    price: number,
    quantity: number,
    shipping_method: string
  ) {
    const subtotal = price * quantity;
    const discount = this.calculateDiscount(price, quantity);
    const shipping_cost = this.calculateShippingCost(
      shipping_method,
      price,
      quantity
    );
    const taxes = this.calculateTaxes(subtotal, discount);
    const total = subtotal - discount + shipping_cost + taxes;

    return { subtotal, discount, shipping_cost, taxes, total };
  }
}
