// Simple logging utility for authentication events

type LogLevel = "info" | "warn" | "error" | "debug"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
}

// In a production app, this would write to a file or external logging service
// For now, we'll store logs in memory and console for development
class Logger {
  private logs: LogEntry[] = []
  private readonly MAX_LOGS = 1000 // Prevent memory issues by limiting stored logs

  log(level: LogLevel, message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const entry: LogEntry = {
      timestamp,
      level,
      message,
      data,
    }

    // Add to in-memory log
    this.logs.push(entry)
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift() // Remove oldest log if we exceed max
    }

    // Also log to console for development
    const consoleData = data ? ` - ${JSON.stringify(data)}` : ""
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}${consoleData}`)

    return entry
  }

  info(message: string, data?: any) {
    return this.log("info", message, data)
  }

  warn(message: string, data?: any) {
    return this.log("warn", message, data)
  }

  error(message: string, data?: any) {
    return this.log("error", message, data)
  }

  debug(message: string, data?: any) {
    return this.log("debug", message, data)
  }

  // Get recent logs for review
  getRecentLogs(count = 50) {
    return this.logs.slice(-count)
  }

  // Get logs filtered by level
  getLogsByLevel(level: LogLevel, count = 50) {
    return this.logs.filter((log) => log.level === level).slice(-count)
  }
}

// Create a singleton instance
const logger = new Logger()

export default logger
