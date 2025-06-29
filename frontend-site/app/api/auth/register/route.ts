import { NextResponse } from "next/server"
import { users } from "@/lib/auth-utils"
import logger from "@/lib/logger"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, role = "applicant" } = body

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      logger.warn("Registration failed - Email already exists", { email })
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    // In a real app, this would create a new user in the database
    // For this demo, we'll just log the registration attempt
    logger.info("User registered", {
      name,
      email,
      role,
      ip: request.headers.get("x-forwarded-for") || "unknown",
    })

    // Return success response
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    logger.error("Registration error", { error: (error as Error).message })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
