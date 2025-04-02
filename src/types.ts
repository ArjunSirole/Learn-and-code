export interface OrderItem {
  itemName: string;
  quantity: number;
  price: number;
}

export interface Order {
  shippingMethod: string;
  paymentMethod: string;
  items: OrderItem[];
}
