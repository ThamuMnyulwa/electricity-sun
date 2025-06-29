"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface ImageWithLoadingProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  className?: string
  containerClassName?: string
}

export function ImageWithLoading({ src, alt, className, containerClassName, ...props }: ImageWithLoadingProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Reset loading state when src changes
    setIsLoading(true)
  }, [src])

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {isLoading && <div className="absolute inset-0 bg-muted animate-pulse" />}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={cn("transition-opacity duration-300", isLoading ? "opacity-0" : "opacity-100", className)}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  )
}
