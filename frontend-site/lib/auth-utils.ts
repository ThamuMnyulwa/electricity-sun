import { SignJWT, jwtVerify } from "jose"
import type { NextResponse } from "next/server"

// Mock users for testing
export const users = [
  {
    id: "1",
    name: "John Doe",
    email: "applicant@example.com",
    password: "password123",
    role: "applicant",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  },
  {
    id: "3",
    name: "Organization User",
    email: "org@example.com",
    password: "password123",
    role: "organization",
  },
]

// Secret key for JWT signing
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_key_change_this_in_production")

// JWT expiration time (24 hours)
const expTime = 60 * 60 * 24

// Sign JWT token
export async function signJwtToken(payload: any) {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${expTime}s`)
      .sign(secretKey)

    return token
  } catch (error) {
    console.error("Error signing JWT:", error)
    throw error
  }
}

// Verify JWT token
export async function verifyJwtToken(token: string) {
  try {
    console.log(`[Auth] Verifying JWT token`)
    const { payload } = await jwtVerify(token, secretKey)
    console.log(`[Auth] JWT token verified successfully`)
    return payload
  } catch (error) {
    console.error("[Auth] Error verifying JWT:", error)
    return null
  }
}

// Set auth cookie
export function setAuthCookie(response: NextResponse, token: string) {
  console.log(`[Auth] Setting auth cookie`)
  response.cookies.set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: expTime,
  })
  return response
}

// Remove auth cookie
export function removeAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: "auth-token",
    value: "",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  })
  return response
}
