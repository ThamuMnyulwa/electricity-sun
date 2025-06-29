import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server-auth"
import logger from "@/lib/logger"

export async function GET(request: Request) {
  try {
    console.log(`[API] Session check requested`)
    const user = await getCurrentUser()

    if (!user) {
      console.log(`[API] No authenticated user found`)
      logger.debug("Session check: No authenticated user")
      return NextResponse.json({ authenticated: false, user: null }, { status: 200 })
    }

    console.log(`[API] User authenticated: ${user.email}, role: ${user.role}`)
    logger.debug("Session check: User authenticated", {
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return NextResponse.json({ authenticated: true, user }, { status: 200 })
  } catch (error) {
    console.error("[API] Session error:", error)
    logger.error("Session error", { error: (error as Error).message })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
