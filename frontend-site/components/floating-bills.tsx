"use client"

import { useEffect, useState } from "react"

interface FloatingElement {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  type: "bill" | "sun" | "leaf"
}

export function FloatingBills() {
  const [elements, setElements] = useState<FloatingElement[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Create initial floating elements
    const initialElements: FloatingElement[] = []
    for (let i = 0; i < 15; i++) {
      initialElements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 15,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.1,
        type: ["bill", "sun", "leaf"][Math.floor(Math.random() * 3)] as "bill" | "sun" | "leaf",
      })
    }
    setElements(initialElements)

    // Animate elements
    const interval = setInterval(() => {
      setElements((prev) =>
        prev.map((element) => ({
          ...element,
          y: element.y > 110 ? -10 : element.y + element.speed,
          x: element.x + Math.sin(element.y * 0.01) * 0.1,
        })),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  const renderElement = (element: FloatingElement) => {
    const baseStyle = {
      position: "absolute" as const,
      left: `${element.x}%`,
      top: `${element.y}%`,
      fontSize: `${element.size}px`,
      opacity: element.opacity,
      pointerEvents: "none" as const,
      userSelect: "none" as const,
      transform: "translateZ(0)",
    }

    switch (element.type) {
      case "bill":
        return (
          <div key={element.id} style={baseStyle} className="text-green-500">
            R
          </div>
        )
      case "sun":
        return (
          <div key={element.id} style={baseStyle} className="text-amber-400">
            ☀
          </div>
        )
      case "leaf":
        return (
          <div key={element.id} style={baseStyle} className="text-emerald-500">
            🍃
          </div>
        )
      default:
        return null
    }
  }

  return <div className="fixed inset-0 overflow-hidden pointer-events-none z-5">{elements.map(renderElement)}</div>
}
