"use client"

import { ReactNode } from "react"
import { useScrollAnimation } from "@/lib/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface ScrollAnimateProps {
  children: ReactNode
  animationId?: string
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right" | "fade"
}

export function ScrollAnimate({
  children,
  animationId,
  className,
  delay = 0,
  direction = "up",
}: ScrollAnimateProps) {
  const { ref, isVisible } = useScrollAnimation({ animationId })

  const getTransform = () => {
    if (!isVisible) {
      switch (direction) {
        case "up":
          return "translateY(20px)"
        case "down":
          return "translateY(-20px)"
        case "left":
          return "translateX(20px)"
        case "right":
          return "translateX(-20px)"
        case "fade":
          return "translateY(0px)"
        default:
          return "translateY(20px)"
      }
    }
    return "translateY(0px)"
  }

  return (
    <div
      ref={ref as React.LegacyRef<HTMLDivElement>}
      className={cn(
        "transition-all duration-700 ease-out",
        className
      )}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

