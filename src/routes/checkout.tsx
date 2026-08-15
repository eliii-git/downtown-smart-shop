"use client";
import { useEffect, useState, useMemo } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Truck,
  CreditCard,
  Wallet,
  Banknote,
  Navigation,
  Star,
  CheckCircle2,
} from "lucide-react";
import {
  getCart,
  getNearbyTransporters,
  getCoordinatesForAddress,
  calculateDistanceKm,
  estimateDeliveryCost,
  estimateEtaMinutes,
  createOrder,
  type CartItem,
  type PaymentMethod,
  type TransporterProfile,
} from "@/lib/cart";
import { getProduct, getShop, ugx } from "@/data/marketplace";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

const paymentMethods: {
  value: PaymentMethod;
  label: string;
  icon: typeof Wallet;
  description: string;
}[] = [
  {
    value: "mtn",
    label: "MTN Mobile Money",
    icon: Wallet,
    description: "Pay instantly with MTN MoMo",
  },
  {
    value: "airtel",
    label: "Airtel Money",
    icon: Wallet,
    description: "Pay instantly with Airtel Money",
  },
  {
    value: "card",
    label: "Credit / Debit Card",
    icon: CreditCard,
    description: "Visa, Mastercard, UnionPay",
  },
  {
    value: "cod",
    label: "Pay on Delivery",
    icon: Banknote,
    description: "Cash when you receive your goods",
  },
];

function CheckoutPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [step, setStep] = useState<"address" | "transporter" | "payment" | "review">("address");
  const [address, setAddress] = useState("");
  const [selectedTransporter, setSelectedTransporter] = useState<TransporterProfile | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const cartItems = useMemo(() => {
    const raw = getCart();
    return raw
      .map((item) => {
        const product = getProduct(item.productId);
        if (!product) return null;
        return { ...item, product };
      })
      .filter(Boolean) as (CartItem & { product: ReturnType<typeof getProduct> })[];
  }, []);

  const subtotal = useMemo(
    () => cartItems.reduce((acc, { product, quantity }) => acc + product.retail * quantity, 0),
    [cartItems],
  );

  const transporters = useMemo(() => {
    if (!address) return [];
    const coords = getCoordinatesForAddress(address);
    return getNearbyTransporters(coords.lat, coords.lng);
  }, [address]);

  const selectedDeliveryCost = useMemo(() => {
    if (!selectedTransporter?.distanceKm) return 0;
    return estimateDeliveryCost(selectedTransporter.distanceKm);
  }, [selectedTransporter]);

  const selectedEta = useMemo(() => {
    if (!selectedTransporter?.distanceKm) return 0;
    return estimateEtaMinutes(selectedTransporter.distanceKm);
  }, [selectedTransporter]);

  const grandTotal = subtotal + selectedDeliveryCost;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      throw redirect({ to: "/auth/signin" });
    }
    if (!isLoading && user?.role !== "customer") {
      throw redirect({ to: "/" });
    }
  }, [isAuthenticated, isLoading, user?.role]);

  if (isLoading) {
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

  if (cartItems.length === 0 && !orderId) {
    return (
      <Shell>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 text-center">
          <h1 className="text-2xl font-bold">Nothing to checkout</h1>
          <p className="mt-2 text-muted-foreground">Your cart is empty.</p>
          <Link to="/market">
            <Button className="mt-4">Browse Products</Button>
          </Link>
        </div>
      </Shell>
    );
  }

  if (orderId) {
    return (
      <Shell>
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Order Confirmed!</h1>
          <p className="mt-2 text-muted-foreground">
            Your order <span className="font-mono font-semibold">{orderId}</span> has been placed.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedTransporter
              ? `${selectedTransporter.name} (${selectedTransporter.company}) is your rider. ETA: ${selectedEta} min`
              : "We are assigning a rider to your delivery."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link to="/customer/dashboard">
              <Button>Go to Dashboard</Button>
            </Link>
            <Link to="/market">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  const handlePlaceOrder = async () => {
    setPlacing(true);
    await new Promise((r) => setTimeout(r, 800));
    const shopId = cartItems[0]?.product.shopId || "";
    const shop = getShop(shopId);
    const order = createOrder({
      userId: user!.id,
      items: cartItems.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
        shopId: i.product.shopId,
      })),
      totalAmount: subtotal,
      deliveryCost: selectedDeliveryCost,
      paymentMethod,
      deliveryAddress: address,
      shopId,
      shopName: shop?.name || "Unknown Shop",
    });

    if (selectedTransporter) {
      const transporters = getNearbyTransporters(
        getCoordinatesForAddress(address).lat,
        getCoordinatesForAddress(address).lng,
      );
      const match =
        transporters.find((t) => t.id === selectedTransporter.id) || selectedTransporter;
      import("@/lib/cart").then((m) => m.assignTransporter(order.id, match));
    }

    setOrderId(order.id);
    setPlacing(false);
  };

  const canProceed = () => {
    switch (step) {
      case "address":
        return address.trim().length > 5;
      case "transporter":
        return true;
      case "payment":
        return !!paymentMethod;
      default:
        return true;
    }
  };

  const steps = [
    { key: "address", label: "Delivery", Icon: MapPin },
    { key: "transporter", label: "Rider", Icon: Truck },
    { key: "payment", label: "Payment", Icon: CreditCard },
    { key: "review", label: "Review", Icon: CheckCircle2 },
  ] as const;

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
                    step === s.key
                      ? "bg-primary text-primary-foreground"
                      : steps.indexOf(step as (typeof steps)[number]) > i
                        ? "bg-green-500/10 text-green-700"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  <s.Icon className="h-3.5 w-3.5" />
                  {s.label}
                </div>
                {i < steps.length - 1 && <div className="h-px w-6 bg-border" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {step === "address" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Where should we deliver?</Label>
                    <Input
                      id="address"
                      placeholder="e.g., Nakawa, Kampala - near the roundabout"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground">
                      We will match you with the nearest available rider from Farasi or Safeboda
                      based on your location.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === "transporter" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" />
                    Available Riders Near You
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {transporters.length === 0 ? (
                    <div className="py-8 text-center">
                      <Truck className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        No riders found nearby. Try a different address.
                      </p>
                      <Button variant="outline" className="mt-3" onClick={() => setStep("address")}>
                        Change Address
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transporters.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setSelectedTransporter(t)}
                          className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                            selectedTransporter?.id === t.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <Truck className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold">{t.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {t.company} · {t.licenseNumber}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={t.available ? "default" : "secondary"}>
                                {t.available ? "Available" : "Busy"}
                              </Badge>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {t.distanceKm?.toFixed(1)} km away
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <Star className="h-3 w-3 fill-primary text-primary" />
                              {t.rating.toFixed(1)}
                            </span>
                            <span>{t.deliveries} deliveries</span>
                            <span>ETA ~{estimateEtaMinutes(t.distanceKm || 0)} min</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                  >
                    <div className="space-y-3">
                      {paymentMethods.map((pm) => (
                        <div
                          key={pm.value}
                          onClick={() => setPaymentMethod(pm.value)}
                          className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                            paymentMethod === pm.value
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value={pm.value} id={pm.value} />
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <pm.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{pm.label}</p>
                              <p className="text-xs text-muted-foreground">{pm.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {step === "review" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-primary" />
                    Review Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">
                        DELIVERY ADDRESS
                      </p>
                      <p className="text-sm font-medium">{address}</p>
                    </div>
                    <div className="border-t border-border pt-3">
                      <p className="text-xs font-semibold text-muted-foreground">RIDER</p>
                      {selectedTransporter ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Truck className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">
                            {selectedTransporter.name} ({selectedTransporter.company})
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {selectedTransporter.distanceKm?.toFixed(1)} km · ~{selectedEta} min
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Assigning nearest rider...</p>
                      )}
                    </div>
                    <div className="border-t border-border pt-3">
                      <p className="text-xs font-semibold text-muted-foreground">PAYMENT</p>
                      <p className="text-sm font-medium">
                        {paymentMethods.find((p) => p.value === paymentMethod)?.label}
                      </p>
                    </div>
                    <div className="border-t border-border pt-3">
                      <p className="text-xs font-semibold text-muted-foreground">ITEMS</p>
                      <div className="mt-2 space-y-2">
                        {cartItems.map(({ product, quantity }) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="line-clamp-1">
                              {product.name} x{quantity}
                            </span>
                            <span className="font-medium">{ugx(product.retail * quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  const idx = steps.findIndex((s) => s.key === step);
                  if (idx > 0) setStep(steps[idx - 1].key);
                }}
                disabled={step === "address"}
              >
                Back
              </Button>
              {step !== "review" ? (
                <Button
                  onClick={() =>
                    setStep(steps[steps.indexOf(step as (typeof steps)[number]) + 1].key)
                  }
                  disabled={!canProceed()}
                >
                  Continue
                </Button>
              ) : (
                <Button onClick={handlePlaceOrder} disabled={placing}>
                  {placing ? "Placing Order..." : `Pay ${ugx(grandTotal)}`}
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Cost Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Goods ({cartItems.length} items)</span>
                    <span className="font-medium">{ugx(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-medium">
                      {step !== "address" && selectedTransporter ? ugx(selectedDeliveryCost) : "—"}
                    </span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between text-base font-bold">
                    <span>Total</span>
                    <span>{ugx(grandTotal)}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                  Delivery fee varies by distance. We match you with the nearest available rider to
                  keep costs low.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
