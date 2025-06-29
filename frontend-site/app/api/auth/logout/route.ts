import { NextResponse } from "next/server"
import { removeAuthCookie } from "@/lib/auth-utils"
import { getCurrentUser } from "@/lib/server-auth"
import logger from "@/lib/logger"

export async function POST(request: Request) {
  try {
    // Get current user before removing cookie
    const user = await getCurrentUser()

    const response = NextResponse.json({ success: true }, { status: 200 })

    // Log logout
    if (user) {
      logger.info("User logged out", {
        userId: user.id,
        email: user.email,
        role: user.role,
      })
    } else {
      logger.info("Logout attempt with no active session")
    }

    return removeAuthCookie(response)
  } catch (error) {
    logger.error("Logout error", { error: (error as Error).message })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
