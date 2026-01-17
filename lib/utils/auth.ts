import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ||
    "your-super-secret-jwt-key-change-this-in-production"
);
const JWT_EXPIRES_IN = "7d";

// --- Password utilities ---
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  if (!password || !hashedPassword) return false;
  return await bcrypt.compare(password, hashedPassword);
}

// --- JWT utilities (Lean Payload to prevent 431 errors) ---

export async function generateToken(
  userId: string,
  role: string = "user"
): Promise<string> {
  try {
    // Strictly essential claims to keep Header size small
    return await new SignJWT({ userId, role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setJti(Math.random().toString(36).substring(7))
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(JWT_SECRET);
  } catch (error) {
    throw new Error("Failed to generate token");
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}

// --- NEW: Compatibility Exports for Build Success ---

/**
 * verifyAuth: Alias for verifyToken used by KYC route
 */
export const verifyAuth = verifyToken;

/**
 * getCurrentUser: Used by Orders, Portfolio, and Transactions routes
 * Automatically reads the cookie and verifies the lean payload
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return null;

    return await verifyToken(token);
  } catch {
    return null;
  }
}

// --- Cookie utilities ---

export function setAuthCookie(response: any, token: string): void {
  response.cookies.set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export function clearAuthCookie(response: any): void {
  response.cookies.set({
    name: "auth-token",
    value: "",
    maxAge: 0,
    path: "/",
  });
}
