import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server-auth"
import logger from "@/lib/logger"

export async function GET(request: Request) {
  try {
    // Check if user is authenticated and is an admin
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      logger.warn("Unauthorized logs access attempt", {
        userId: user?.id,
        email: user?.email,
        role: user?.role,
      })
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get query parameters
    const url = new URL(request.url)
    const level = url.searchParams.get("level") as "info" | "warn" | "error" | "debug" | null
    const count = Number.parseInt(url.searchParams.get("count") || "50", 10)

    // Get logs based on parameters
    const logs = level ? logger.getLogsByLevel(level, count) : logger.getRecentLogs(count)

    return NextResponse.json({ logs }, { status: 200 })
  } catch (error) {
    logger.error("Error retrieving logs", { error: (error as Error).message })
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
