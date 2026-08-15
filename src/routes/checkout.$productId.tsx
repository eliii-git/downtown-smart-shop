"use client";
import { useEffect, useState, useMemo } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { ArrowLeft, Truck, CreditCard, Wallet, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getProduct, ugx } from "@/data/marketplace";
import { createOrder, type PaymentMethod, type Order } from "@/lib/orders";

export const Route = createFileRoute("/checkout/$productId")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const productId = Route.useParams().productId;
  const product = getProduct(productId);

  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [transportCompany, setTransportCompany] = useState<"Farasi" | "SafeBoda" | "">("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      navigate({ to: "/auth/signin" });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  useEffect(() => {
    if (user?.defaultAddress && !deliveryAddress) {
      setDeliveryAddress(user.defaultAddress);
    }
  }, [user, deliveryAddress]);

  const deliveryCost = useMemo(() => product?.deliveryCost ?? 0, [product]);
  const itemTotal = useMemo(() => (product?.retail ?? 0) * quantity, [product, quantity]);
  const totalAmount = useMemo(() => itemTotal + deliveryCost, [itemTotal, deliveryCost]);

  if (isLoading || !isAuthenticated || !user) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading checkout...</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (!product) {
    return (
      <Shell>
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link to="/market">
            <Button className="mt-4">Back to Market</Button>
          </Link>
        </div>
      </Shell>
    );
  }

  if (orderPlaced) {
    return (
      <Shell>
        <div className="mx-auto max-w-2xl px-4 py-16">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-2xl">Order Placed Successfully</CardTitle>
              <CardDescription>
                Your order <span className="font-mono font-semibold">{orderPlaced.id}</span> has been created.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{orderPlaced.productName}</p>
                    <p className="text-xs text-muted-foreground">Qty: {orderPlaced.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">{ugx(orderPlaced.totalAmount)}</p>
                </div>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p>Transporter: {orderPlaced.transporterName} ({orderPlaced.transportCompany})</p>
                  <p>Payment: {orderPlaced.paymentMethod === "cod" ? "Pay on Delivery" : orderPlaced.paymentMethod.toUpperCase()}</p>
                  <p>Status: <Badge variant="outline" className="capitalize">{orderPlaced.status}</Badge></p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link to="/customer/dashboard" className="flex-1">
                  <Button className="w-full">View My Orders</Button>
                </Link>
                <Link to="/market" className="flex-1">
                  <Button variant="outline" className="w-full">Continue Shopping</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Shell>
    );
  }

  const handlePlaceOrder = async () => {
    setError("");
    if (!deliveryAddress.trim()) {
      setError("Please enter a delivery address");
      return;
    }
    if (!transportCompany) {
      setError("Please select a transport company");
      return;
    }

    setPlacing(true);
    try {
      const order = await createOrder({
        productId,
        quantity,
        deliveryAddress: deliveryAddress.trim(),
        transportCompany,
        paymentMethod,
      });
      setOrderPlaced(order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
      setPlacing(false);
    }
  };

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link to={`/product/${productId}` as any}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
                <CardDescription>Where should we deliver this order?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="e.g., Nakawa, Kampala"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transport Company</CardTitle>
                <CardDescription>Choose your preferred delivery service</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={transportCompany} onValueChange={(v) => setTransportCompany(v as "Farasi" | "SafeBoda")}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label
                      htmlFor="farasi"
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                        transportCompany === "Farasi" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <RadioGroupItem value="Farasi" id="farasi" />
                      <div>
                        <p className="text-sm font-semibold">Farasi</p>
                        <p className="text-xs text-muted-foreground">Reliable cargo delivery</p>
                      </div>
                    </label>
                    <label
                      htmlFor="safeboda"
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                        transportCompany === "SafeBoda" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <RadioGroupItem value="SafeBoda" id="safeboda" />
                      <div>
                        <p className="text-sm font-semibold">SafeBoda</p>
                        <p className="text-xs text-muted-foreground">Fast motorcycle delivery</p>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Select how you would like to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
                  <div className="grid gap-3">
                    <label
                      htmlFor="credit-card"
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                        paymentMethod === "credit_card" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <RadioGroupItem value="credit_card" id="credit-card" />
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-semibold">Credit / Debit Card</p>
                        <p className="text-xs text-muted-foreground">Visa, Mastercard</p>
                      </div>
                    </label>
                    <label
                      htmlFor="mtn"
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                        paymentMethod === "mtn" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <RadioGroupItem value="mtn" id="mtn" />
                      <Wallet className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-sm font-semibold">MTN Mobile Money</p>
                        <p className="text-xs text-muted-foreground">Pay with MTN MoMo</p>
                      </div>
                    </label>
                    <label
                      htmlFor="airtel"
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                        paymentMethod === "airtel" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <RadioGroupItem value="airtel" id="airtel" />
                      <Wallet className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="text-sm font-semibold">Airtel Money</p>
                        <p className="text-xs text-muted-foreground">Pay with Airtel Money</p>
                      </div>
                    </label>
                    <label
                      htmlFor="cod"
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                        paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <RadioGroupItem value="cod" id="cod" />
                      <Wallet className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-semibold">Pay on Delivery</p>
                        <p className="text-xs text-muted-foreground">Cash when you receive your order</p>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.shopId}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Item Price</span>
                    <span>{ugx(product.retail)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Quantity</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="w-4 text-center text-sm">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setQuantity((q) => q + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{ugx(itemTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      {ugx(deliveryCost)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-lg font-bold">{ugx(totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  disabled={placing || !transportCompany || !deliveryAddress.trim()}
                  onClick={handlePlaceOrder}
                >
                  {placing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    `Pay ${ugx(totalAmount)}`
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  By placing this order, you agree to DownTown Uganda's terms of service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
