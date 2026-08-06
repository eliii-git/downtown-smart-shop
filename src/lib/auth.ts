import { randomUUID } from "crypto";
import { loginSchema, signupSchema, type User, type UserRole } from "./auth-schema";

const users: Map<string, User & { password: string }> = new Map();
const sessions: Map<string, { userId: string; expires: number }> = new Map();

export async function signup(input: unknown): Promise<{ user: User; token: string }> {
  const data = signupSchema.parse(input);
  const existing = Array.from(users.values()).find((u) => u.email === data.email);
  if (existing) throw new Error("An account with this email already exists");

  const id = randomUUID();
  const user: User = {
    id,
    email: data.email,
    name: data.name,
    phone: data.phone,
    role: data.role,
    businessName: data.businessName,
    shopLocation: data.shopLocation,
    transportCompany: data.transportCompany,
    vehicleType: data.vehicleType,
    licenseNumber: data.licenseNumber,
    defaultAddress: data.defaultAddress,
  };
  users.set(id, { ...user, password: data.password });
  const token = randomUUID();
  sessions.set(token, { userId: id, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  return { user, token };
}

export async function login(input: unknown): Promise<{ user: User; token: string }> {
  const data = loginSchema.parse(input);
  const userEntry = Array.from(users.values()).find(
    (u) => u.email === data.email && u.password === data.password
  );
  if (!userEntry) throw new Error("Invalid email or password");

  const { password, ...user } = userEntry;
  const token = randomUUID();
  sessions.set(token, { userId: user.id, expires: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  return { user, token };
}

export async function getCurrentUser(token: string | null): Promise<User | null> {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session || session.expires < Date.now()) {
    sessions.delete(token);
    return null;
  }
  const userEntry = users.get(session.userId);
  if (!userEntry) return null;
  const { password, ...user } = userEntry;
  return user;
}

export async function logout(token: string): Promise<void> {
  sessions.delete(token);
}
