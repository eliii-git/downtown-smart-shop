"use client";
import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/site/Shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { ArrowLeft, Plus, Upload, Image as ImageIcon } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/vendor/add-product")({
  component: AddProduct,
});

const categories = [
  "Electronics",
  "Fabric & Textiles",
  "Kitchenware",
  "Phones & Accessories",
  "Furniture",
  "Hardware",
  "Fashion",
  "Beauty",
  "Other",
];

function AddProduct() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    retailPrice: "",
    wholesalePrice: "",
    bulkPrice: "",
    stock: "",
    description: "",
    specs: "",
    warrantyMonths: "",
    deliveryDays: "",
    deliveryCost: "",
    authenticity: "Verified original",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "vendor")) {
      navigate({ to: "/auth/signin", replace: true });
    }
  }, [isAuthenticated, isLoading, user?.role, navigate]);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.name || !formData.category || !formData.retailPrice || !formData.stock) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setSuccess("Product added successfully!");
      setLoading(false);
    }, 800);
  };

  const handleSuccessRedirect = () => {
    setTimeout(() => {
      navigate({ to: "/vendor/dashboard" });
    }, 1200);
  };

  useEffect(() => {
    if (success) {
      handleSuccessRedirect();
    }
  }, [success]);

  if (isLoading) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Shell>
    );
  }

  if (!isAuthenticated || !user || user.role !== "vendor") {
    return null;
  }

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center gap-4">
          <Link to="/vendor/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Add New Product</h1>
            <p className="text-sm text-muted-foreground">List a new product in your shop</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg border border-green-500/50 bg-green-500/10 p-3 text-sm text-green-600">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="e.g., Samsung Galaxy A54"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => updateField("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat.toLowerCase()}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => updateField("stock", e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="retailPrice">Retail Price (UGX) *</Label>
                    <Input
                      id="retailPrice"
                      type="number"
                      value={formData.retailPrice}
                      onChange={(e) => updateField("retailPrice", e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wholesalePrice">Wholesale Price (UGX)</Label>
                    <Input
                      id="wholesalePrice"
                      type="number"
                      value={formData.wholesalePrice}
                      onChange={(e) => updateField("wholesalePrice", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bulkPrice">Bulk Price (UGX)</Label>
                    <Input
                      id="bulkPrice"
                      type="number"
                      value={formData.bulkPrice}
                      onChange={(e) => updateField("bulkPrice", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Describe your product..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specs">Specifications (comma-separated)</Label>
                  <Input
                    id="specs"
                    value={formData.specs}
                    onChange={(e) => updateField("specs", e.target.value)}
                    placeholder="e.g., 128GB, 6GB RAM, 5000mAh"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="warrantyMonths">Warranty (months)</Label>
                    <Input
                      id="warrantyMonths"
                      type="number"
                      value={formData.warrantyMonths}
                      onChange={(e) => updateField("warrantyMonths", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDays">Delivery (days)</Label>
                    <Input
                      id="deliveryDays"
                      type="number"
                      value={formData.deliveryDays}
                      onChange={(e) => updateField("deliveryDays", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryCost">Delivery Cost (UGX)</Label>
                    <Input
                      id="deliveryCost"
                      type="number"
                      value={formData.deliveryCost}
                      onChange={(e) => updateField("deliveryCost", e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authenticity">Authenticity</Label>
                  <Select value={formData.authenticity} onValueChange={(value) => updateField("authenticity", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Verified original">Verified Original</SelectItem>
                      <SelectItem value="Grade A copy">Grade A Copy</SelectItem>
                      <SelectItem value="Refurbished">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Product Images</Label>
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Drag and drop images here, or</p>
                      <Button type="button" variant="outline" size="sm" className="mt-2">
                        <Upload className="mr-2 h-4 w-4" />
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex items-center justify-end gap-3">
            <Link to="/vendor/dashboard">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading}>
              {loading && <Plus className="mr-2 h-4 w-4 animate-spin" />}
              Add Product
            </Button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
