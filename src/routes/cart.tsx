"use client";
import { useEffect, useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { getCart, removeFromCart, updateCartQuantity, clearCart, type CartItem } from "@/lib/cart";
import { getProduct, getShop, ugx } from "@/data/marketplace";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      throw redirect({ to: "/auth/signin" });
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    setItems(getCart());
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    const item = items.find((i) => i.productId === productId);
    if (item) {
      updateCartQuantity(productId, item.quantity + delta);
      setItems(getCart());
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    window.location.href = "/checkout";
  };

  if (isLoading) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading cart...</p>
          </div>
        </div>
      </Shell>
    );
  }

  const cartProducts = items
    .map((item) => {
      const product = getProduct(item.productId);
      if (!product) return null;
      return { ...item, product };
    })
    .filter(Boolean);

  const subtotal = cartProducts.reduce(
    (acc, { product, quantity }) => acc + product.retail * quantity,
    0,
  );

  return (
    <Shell>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearCart();
                setItems([]);
              }}
            >
              Clear cart
            </Button>
          )}
        </div>

        {cartProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">Your cart is empty</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse the market and add products to get started
            </p>
            <Link to="/market">
              <Button className="mt-4">
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {cartProducts.map(({ product, quantity }) => {
                const shop = getShop(product.shopId);
                return (
                  <Card key={product.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-24 w-24 shrink-0 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold line-clamp-2">{product.name}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">{shop?.name}</p>
                          <p className="mt-2 font-display text-lg font-bold">
                            {ugx(product.retail)}
                          </p>
                          <div className="mt-2 flex items-center gap-3">
                            <div className="flex items-center rounded-lg border border-border">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(product.id, -1)}
                                className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-foreground"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="h-8 w-10 place-items-center text-sm font-medium">
                                {quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(product.id, 1)}
                                className="grid h-8 w-8 place-items-center text-muted-foreground hover:text-foreground"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemove(product.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{ugx(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery</span>
                      <span className="font-medium">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between text-base font-bold">
                      <span>Total</span>
                      <span>{ugx(subtotal)} + delivery</span>
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleCheckout}>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
