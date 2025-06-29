import { type NextRequest, NextResponse } from "next/server"
import { users, signJwtToken, setAuthCookie } from "@/lib/auth-utils"
import logger from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Log login attempt
    console.log(`[API] Login attempt for: ${email}`)
    logger.info("Login attempt", { email, ip: request.headers.get("x-forwarded-for") || "unknown" })

    // Find user
    const user = users.find((user) => user.email === email)

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      const reason = !user ? "User not found" : "Invalid password"
      console.log(`[API] Login failed: ${reason}`)
      logger.warn("Failed login attempt - Invalid credentials", {
        email,
        reason,
        ip: request.headers.get("x-forwarded-for") || "unknown",
      })
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create payload for JWT
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    console.log(`[API] User authenticated: ${user.email}, role: ${user.role}`)

    // Sign JWT token
    const token = await signJwtToken(payload)
    console.log(`[API] JWT token generated successfully`)

    // Log successful login
    logger.info("Successful login", {
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: request.headers.get("x-forwarded-for") || "unknown",
    })

    // Create response
    const response = NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    )

    // Set auth cookie
    console.log(`[API] Setting auth cookie`)
    return setAuthCookie(response, token)
  } catch (error) {
    console.error("[API] Login error:", error)
    logger.error("Login error", { error: (error as Error).message })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
