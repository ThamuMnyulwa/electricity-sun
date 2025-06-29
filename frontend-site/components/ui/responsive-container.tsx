"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  breakpoints?: {
    sm?: string
    md?: string
    lg?: string
    xl?: string
  }
}

export function ResponsiveContainer({
  children,
  className,
  breakpoints = {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
}: ResponsiveContainerProps) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string | null>(null)

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth

      if (width < Number.parseInt(breakpoints.sm || "640")) {
        setCurrentBreakpoint("xs")
      } else if (width < Number.parseInt(breakpoints.md || "768")) {
        setCurrentBreakpoint("sm")
      } else if (width < Number.parseInt(breakpoints.lg || "1024")) {
        setCurrentBreakpoint("md")
      } else if (width < Number.parseInt(breakpoints.xl || "1280")) {
        setCurrentBreakpoint("lg")
      } else {
        setCurrentBreakpoint("xl")
      }
    }

    // Initial check
    updateBreakpoint()

    // Add resize listener
    window.addEventListener("resize", updateBreakpoint)

    // Cleanup
    return () => window.removeEventListener("resize", updateBreakpoint)
  }, [breakpoints])

  return (
    <div className={cn("transition-all duration-300", className)} data-breakpoint={currentBreakpoint}>
      {children}
    </div>
  )
}
