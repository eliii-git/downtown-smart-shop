"use client";
import { loginSchema, signupSchema, type User, type UserRole } from "./auth-schema";

const USERS_KEY = "dt_users";
const SESSION_KEY = "dt_auth_token";

function getUsers(): (User & { password: string })[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users: (User & { password: string })[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function signup(input: unknown): Promise<{ user: User; token: string }> {
  const data = signupSchema.parse(input);
  const users = getUsers();
  const existing = users.find((u) => u.email === data.email);
  if (existing) throw new Error("An account with this email already exists");

  const id = generateId();
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
  users.push({ ...user, password: data.password });
  saveUsers(users);

  localStorage.setItem(SESSION_KEY, id);
  return { user, token: id };
}

export async function login(input: unknown): Promise<{ user: User; token: string }> {
  const data = loginSchema.parse(input);
  const users = getUsers();
  const userEntry = users.find(
    (u) => u.email === data.email && u.password === data.password
  );
  if (!userEntry) throw new Error("Invalid email or password");

  const { password, ...user } = userEntry;
  localStorage.setItem(SESSION_KEY, user.id);
  return { user, token: user.id };
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;
  const userId = localStorage.getItem(SESSION_KEY);
  if (!userId) return null;

  const users = getUsers();
  const userEntry = users.find((u) => u.id === userId);
  if (!userEntry) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }

  const { password, ...user } = userEntry;
  return user;
}

export async function logout(): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
