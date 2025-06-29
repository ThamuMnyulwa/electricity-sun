"use server"

import { cookies } from "next/headers"
import { verifyJwtToken } from "./auth-utils"

// Get auth cookie - server only
export async function getAuthCookie() {
  const cookieStore = cookies()
  return cookieStore.get("auth-token")?.value
}

// Get current user from token - server only
export async function getCurrentUser() {
  const token = await getAuthCookie()

  if (!token) {
    console.log(`[Auth] No auth token found in cookies`)
    return null
  }

  try {
    console.log(`[Auth] Verifying token from cookie`)
    const payload = await verifyJwtToken(token)
    if (!payload) {
      console.log(`[Auth] Invalid token in cookie`)
      return null
    }

    console.log(`[Auth] User authenticated from token: ${payload.email}`)
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as string,
    }
  } catch (error) {
    console.error("[Auth] Error getting current user:", error)
    return null
  }
}
