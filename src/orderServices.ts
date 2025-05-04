import { OrderItem } from "./types";

export class OrderService {
  static calculateShippingCost(
    shippingMethod: string,
    price: number,
    quantity: number
  ): number {
    if (shippingMethod === "Free") return 0;
    if (price * quantity > 10000) {
      return shippingMethod === "Express" ? 100 : 50;
    }
    return shippingMethod === "Express" ? 200 : 100;
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

  static calculateOrderSummary(
    price: number,
    quantity: number,
    shippingMethod: string
  ) {
    const subtotal = price * quantity;
    const discount = this.calculateDiscount(price, quantity);
    const shippingCost = this.calculateShippingCost(
      shippingMethod,
      price,
      quantity
    );
    const taxes = this.calculateTaxes(subtotal, discount);
    const total = subtotal - discount + shippingCost + taxes;

    return { subtotal, discount, shippingCost, taxes, total };
  }
}
