"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Laptop, Smartphone, Tablet } from "lucide-react"
import { cn } from "@/lib/utils"

interface DevicePreviewProps {
  children: React.ReactNode
  className?: string
}

export function DevicePreview({ children, className }: DevicePreviewProps) {
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop")

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <span className="text-sm font-medium">Device Preview</span>
        <div className="flex items-center gap-2">
          <Button
            variant={device === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => setDevice("mobile")}
            className="h-8 w-8 p-0"
          >
            <Smartphone className="h-4 w-4" />
            <span className="sr-only">Mobile</span>
          </Button>
          <Button
            variant={device === "tablet" ? "default" : "outline"}
            size="sm"
            onClick={() => setDevice("tablet")}
            className="h-8 w-8 p-0"
          >
            <Tablet className="h-4 w-4" />
            <span className="sr-only">Tablet</span>
          </Button>
          <Button
            variant={device === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => setDevice("desktop")}
            className="h-8 w-8 p-0"
          >
            <Laptop className="h-4 w-4" />
            <span className="sr-only">Desktop</span>
          </Button>
        </div>
      </div>
      <div className="p-4 overflow-auto bg-background">
        <div
          className={cn(
            "mx-auto transition-all duration-300 transform-gpu",
            device === "mobile" && "w-[375px]",
            device === "tablet" && "w-[768px]",
            device === "desktop" && "w-full max-w-[1200px]",
          )}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
