import { type User, type TransportCompany } from "./auth-schema";
import { getCurrentUser } from "./auth";
import { getProduct } from "@/data/marketplace";

export type PaymentMethod = "credit_card" | "mtn" | "airtel" | "cod";
export type OrderStatus = "pending" | "assigned" | "in_transit" | "delivered" | "cancelled";

export type Order = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  shopId: string;
  shopName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  quantity: number;
  itemPrice: number;
  deliveryCost: number;
  transportCompany: "Farasi" | "SafeBoda";
  transporterId: string;
  transporterName: string;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "cod";
  status: OrderStatus;
  deliveryAddress: string;
  totalAmount: number;
  createdAt: string;
};

const ORDERS_KEY = "dt_orders";
const USERS_KEY = "dt_users";

function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ORDERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function getUsers(): (User & { password: string })[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getAvailableTransporters(company: "Farasi" | "SafeBoda"): (User & { password: string })[] {
  const users = getUsers();
  const orders = getOrders();
  
  return users.filter((u) => {
    if (u.role !== "transport") return false;
    if (u.transportCompany !== company) return false;
    
    const activeOrders = orders.filter(
      (o) => o.transporterId === u.id && (o.status === "assigned" || o.status === "in_transit")
    );
    return activeOrders.length === 0;
  });
}

export async function createOrder(input: {
  productId: string;
  quantity: number;
  deliveryAddress: string;
  transportCompany: "Farasi" | "SafeBoda";
  paymentMethod: PaymentMethod;
}): Promise<Order> {
  const product = getProduct(input.productId);
  if (!product) throw new Error("Product not found");

  const user = await getCurrentUser();
  if (!user) throw new Error("You must be logged in to place an order");

  const transporters = getAvailableTransporters(input.transportCompany);
  const transporter = transporters[0] || getUsers().find((u) => u.role === "transport" && u.transportCompany === input.transportCompany);
  
  if (!transporter) throw new Error("No transporters available for the selected company");

  const shop = product.shopId;
  const deliveryCost = product.deliveryCost;
  const itemPrice = product.retail * input.quantity;
  const totalAmount = itemPrice + deliveryCost;

  const order: Order = {
    id: `ORD-${Date.now().toString(36).toUpperCase()}`,
    productId: input.productId,
    productName: product.name,
    productImage: product.image,
    shopId: product.shopId,
    shopName: product.shopId,
    customerId: user.id,
    customerName: user.name,
    customerPhone: user.phone,
    quantity: input.quantity,
    itemPrice,
    deliveryCost,
    transportCompany: input.transportCompany,
    transporterId: transporter.id,
    transporterName: transporter.name,
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentMethod === "cod" ? "cod" : "pending",
    status: "pending",
    deliveryAddress: input.deliveryAddress,
    totalAmount,
    createdAt: new Date().toISOString(),
  };

  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);

  return order;
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return getOrders().filter((o) => o.customerId === customerId);
}

export function getOrdersByShop(shopId: string): Order[] {
  return getOrders().filter((o) => o.shopId === shopId);
}

export function getOrdersByTransporter(transporterId: string): Order[] {
  return getOrders().filter((o) => o.transporterId === transporterId);
}

export function updateOrderStatus(orderId: string, status: Order["status"]): Order | null {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) return null;

  const existing = orders[index] as Order;
  const updated: Order = { ...existing, status };
  orders[index] = updated;
  saveOrders(orders);
  return updated;
}

export function getAllOrders(): Order[] {
  return getOrders();
}
