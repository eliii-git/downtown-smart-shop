import { z } from "zod";

export const userRoles = ["vendor", "transport", "customer"] as const;
export type UserRole = (typeof userRoles)[number];

export const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone number is required"),
    role: z.enum(userRoles),
    businessName: z.string().optional(),
    shopLocation: z.string().optional(),
    transportCompany: z.string().optional(),
    licenseNumber: z.string().optional(),
    defaultAddress: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.role === "vendor") return !!data.businessName && !!data.shopLocation;
      if (data.role === "transport") return !!data.transportCompany && !!data.licenseNumber;
      if (data.role === "customer") return true;
      return true;
    },
    { message: "Please fill in all required fields for your role", path: ["role"] },
  );

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  businessName?: string;
  shopLocation?: string;
  transportCompany?: string;
  vehicleType?: string;
  licenseNumber?: string;
  defaultAddress?: string;
}
