"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface FadeInProps {
  children: React.ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right" | "none"
  delay?: number
  duration?: number
  once?: boolean
}

export function FadeIn({ children, className, direction = "up", delay = 0, duration = 0.5, once = true }: FadeInProps) {
  const directionOffset = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {},
  }

  return (
    <div
      className={cn("opacity-0", className)}
      style={{
        animation: `fadeIn ${duration}s ease-out ${delay}s forwards`,
        transform: `translate${direction === "up" || direction === "down" ? "Y" : "X"}(${
          direction === "up" ? "20px" : direction === "down" ? "-20px" : direction === "left" ? "20px" : "-20px"
        })`,
      }}
    >
      {children}
    </div>
  )
}
