export type CartItem = {
  productId: string;
  quantity: number;
  shopId: string;
};

export type PaymentMethod = "mtn" | "airtel" | "card" | "cod";

export type PaymentStatus = "pending" | "paid" | "failed";

export type OrderStatus =
  "pending" | "confirmed" | "assigned" | "in_transit" | "delivered" | "cancelled";

export type Order = {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryCost: number;
  grandTotal: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryAddress: string;
  transporterId?: string;
  transporterName?: string;
  transporterCompany?: string;
  distanceKm?: number;
  etaMinutes?: number;
  createdAt: string;
  shopId: string;
  shopName: string;
};

export type TransporterProfile = {
  id: string;
  name: string;
  company: "Farasi" | "Safeboda";
  licenseNumber: string;
  lat: number;
  lng: number;
  available: boolean;
  rating: number;
  deliveries: number;
};

const CART_KEY = "dt_cart";
const ORDERS_KEY = "dt_orders";
const TRANSPORTERS_KEY = "dt_transporters";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const existing = cart.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function removeFromCart(productId: string) {
  const cart = getCart().filter((i) => i.productId !== productId);
  saveCart(cart);
}

export function updateCartQuantity(productId: string, quantity: number) {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId);
  if (item) {
    item.quantity = Math.max(1, quantity);
  }
  saveCart(cart);
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(ORDERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function createOrder(input: {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryCost: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: string;
  shopId: string;
  shopName: string;
}): Order {
  const orders = getOrders();
  const order: Order = {
    id: `ORD-${Date.now().toString(36).toUpperCase()}`,
    ...input,
    grandTotal: input.totalAmount + input.deliveryCost,
    status: "pending",
    paymentStatus: input.paymentMethod === "cod" ? "pending" : "paid",
    createdAt: new Date().toISOString(),
  };
  orders.unshift(order);
  saveOrders(orders);
  clearCart();
  return order;
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  const orders = getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    saveOrders(orders);
  }
}

export function assignTransporter(orderId: string, transporter: TransporterProfile) {
  const orders = getOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.transporterId = transporter.id;
    order.transporterName = transporter.name;
    order.transporterCompany = transporter.company;
    order.status = "assigned";
    saveOrders(orders);
  }
}

export function getTransporters(): TransporterProfile[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(TRANSPORTERS_KEY);
  if (raw) return JSON.parse(raw);

  const users = getUsers();
  const transporters: TransporterProfile[] = users
    .filter((u) => u.role === "transport")
    .map((u, index) => ({
      id: u.id,
      name: u.name,
      company: (u.transportCompany as TransporterProfile["company"]) || "Farasi",
      licenseNumber: u.licenseNumber || "",
      lat: 0.3476 + (Math.random() - 0.5) * 0.1,
      lng: 32.5825 + (Math.random() - 0.5) * 0.1,
      available: index < 4,
      rating: 4.2 + Math.random() * 0.8,
      deliveries: Math.floor(Math.random() * 500) + 50,
    }));

  localStorage.setItem(TRANSPORTERS_KEY, JSON.stringify(transporters));
  return transporters;
}

export function refreshTransporters() {
  localStorage.removeItem(TRANSPORTERS_KEY);
  return getTransporters();
}

function getUsers() {
  const raw = localStorage.getItem("dt_users");
  return raw ? JSON.parse(raw) : [];
}

const KAMPALA_CENTER = { lat: 0.3476, lng: 32.5825 };

export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getNearbyTransporters(
  customerLat: number,
  customerLng: number,
  maxKm = 15,
): TransporterProfile[] {
  const transporters = getTransporters().filter((t) => t.available);
  return transporters
    .map((t) => ({
      ...t,
      distanceKm: calculateDistanceKm(customerLat, customerLng, t.lat, t.lng),
    }))
    .filter((t) => (t.distanceKm || 0) <= maxKm)
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
    .slice(0, 5);
}

export function estimateDeliveryCost(distanceKm: number, baseCost = 2000): number {
  return Math.round(baseCost + distanceKm * 1500);
}

export function estimateEtaMinutes(distanceKm: number): number {
  return Math.max(10, Math.round(distanceKm * 8 + 10));
}

export function getCoordinatesForAddress(address: string): { lat: number; lng: number } {
  const hash = address.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return {
    lat: 0.3476 + ((hash % 1000) / 1000) * 0.08 - 0.04,
    lng: 32.5825 + (((hash * 7) % 1000) / 1000) * 0.08 - 0.04,
  };
}
