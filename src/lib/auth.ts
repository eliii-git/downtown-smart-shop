import { loginSchema, signupSchema, type User, type UserRole } from "./auth-schema";

const USERS_KEY = "dt_users";
const SESSION_KEY = "dt_auth_token";

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "vendor":
      return "/vendor/dashboard";
    case "transport":
      return "/transport/dashboard";
    case "customer":
      return "/customer/dashboard";
    default:
      return "/";
  }
}

type StoredUser = User & { password: string };

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users: StoredUser[]) {
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
    ...(data.businessName !== undefined ? { businessName: data.businessName } : {}),
    ...(data.shopLocation !== undefined ? { shopLocation: data.shopLocation } : {}),
    ...(data.transportCompany !== undefined ? { transportCompany: data.transportCompany } : {}),
    ...(data.licenseNumber !== undefined ? { licenseNumber: data.licenseNumber } : {}),
    ...(data.defaultAddress !== undefined ? { defaultAddress: data.defaultAddress } : {}),
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

export async function syncToCloud(): Promise<void> {
  if (typeof window === "undefined") return;
  
  const cloudUrl = import.meta.env['VITE_DATABASE_URL'];
  const apiKey = import.meta.env['VITE_DATABASE_API_KEY'];

  if (!cloudUrl || !apiKey) {
    console.log("Cloud sync skipped: no DATABASE_URL or API_KEY configured");
    return;
  }

  try {
    const users = getUsers();
    const sessionToken = localStorage.getItem(SESSION_KEY);
    
    await fetch(cloudUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        action: "sync",
        users,
        sessionToken,
        timestamp: Date.now(),
      }),
    });
  } catch (error) {
    console.error("Cloud sync failed:", error);
  }
}

export async function loadFromCloud(): Promise<void> {
  if (typeof window === "undefined") return;
  
  const cloudUrl = import.meta.env['VITE_DATABASE_URL'];
  const apiKey = import.meta.env['VITE_DATABASE_API_KEY'];

  if (!cloudUrl || !apiKey) {
    console.log("Cloud load skipped: no DATABASE_URL or API_KEY configured");
    return;
  }

  try {
    const response = await fetch(cloudUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) return;

    const data = await response.json();
    if (data.users && Array.isArray(data.users)) {
      saveUsers(data.users);
      if (data.sessionToken) {
        localStorage.setItem(SESSION_KEY, data.sessionToken);
      }
    }
  } catch (error) {
    console.error("Cloud load failed:", error);
  }
}
