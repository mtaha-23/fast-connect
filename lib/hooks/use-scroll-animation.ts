"use client"

import { useEffect, useRef, useState } from "react"

interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  animationId?: string // Unique ID for this element to track in sessionStorage
}

export function useScrollAnimation({
  threshold = 0.1,
  rootMargin = "0px",
  animationId,
}: UseScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Check if sessionStorage is available (client-side only)
    if (typeof window === "undefined") return

    // Check if this element has already been animated
    const storageKey = animationId || `scroll-animation-${element.getBoundingClientRect().top}`
    const hasAnimated = sessionStorage.getItem(storageKey) === "true"

    // If already animated, set visible immediately
    if (hasAnimated) {
      setIsVisible(true)
      return
    }

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            // Mark as animated in sessionStorage (if available)
            if (typeof window !== "undefined") {
              sessionStorage.setItem(storageKey, "true")
            }
            // Unobserve after animation triggers
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, animationId])

  return { ref: elementRef, isVisible }
}

