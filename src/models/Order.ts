// // src/models/Order.ts
// export class Order {
//   constructor(
//     public item_name: string,
//     public quantity: number,
//     public price: number,
//     public shipping_method: string,
//     public payment_method: string
//   ) {}

//   // Calculate Shipping Cost
//   calculateShippingCost(): number {
//     if (this.shipping_method === "Free") return 0;

//     if (this.price * this.quantity > 10000) {
//       return this.shipping_method === "Express" ? 100 : 50;
//     }

//     return this.shipping_method === "Express" ? 200 : 100;
//   }

//   // Calculate Discount
//   calculateDiscount(): number {
//     const subtotal = this.price * this.quantity;
//     if (subtotal > 50000) return subtotal * 0.15;
//     if (subtotal > 25000) return subtotal * 0.1;
//     if (subtotal > 10000) return subtotal * 0.075;
//     if (subtotal > 5000) return subtotal * 0.05;
//     return 0;
//   }

//   // Calculate Taxes (SGST 2.5% + CGST 2.5%)
//   calculateTaxes(subtotal: number, discount: number): number {
//     const taxableAmount = subtotal - discount;
//     return taxableAmount * 0.05;
//   }

//   // Calculate Total Amount
//   calculateTotal() {
//     const subtotal = this.price * this.quantity;
//     const discount = this.calculateDiscount();
//     const shipping_cost = this.calculateShippingCost();
//     const taxes = this.calculateTaxes(subtotal, discount);
//     const total = subtotal - discount + shipping_cost + taxes;

//     return { subtotal, discount, shipping_cost, taxes, total };
//   }
// }

export class Order {
    private static readonly TAX_RATE = 0.05;
    private static readonly DISCOUNT_THRESHOLDS = [
        { minAmount: 50000, rate: 0.15 },
        { minAmount: 25000, rate: 0.10 },
        { minAmount: 10000, rate: 0.075 },
        { minAmount: 5000, rate: 0.05 }
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
            ? (this.shippingMethod === "Express" ? 100 : 50) 
            : (this.shippingMethod === "Express" ? 200 : 100);
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

    public getTotal(): { subtotal: number; discount: number; shippingCost: number; taxes: number; total: number } {
        const subtotal = this.price * this.quantity;
        const discount = this.calculateDiscount();
        const shippingCost = this.calculateShippingCost();
        const taxes = this.calculateTaxes(subtotal, discount);
        const total = subtotal - discount + shippingCost + taxes;

        return { subtotal, discount, shippingCost, taxes, total };
    }
}
