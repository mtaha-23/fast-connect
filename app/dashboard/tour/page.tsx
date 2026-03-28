"use client"

import { useState, useRef } from "react"
import { DashboardHeader } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ExternalLink, Maximize2, Loader2 } from "lucide-react"

export default function TourPage() {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        title="360° Campus Tour"
        description="Explore FAST University in an interactive panoramic viewer"
      />

      <div className="p-2 sm:p-4 md:p-6 pb-6 sm:pb-10">
        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4">
          <div className="relative rounded-xl sm:rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
            {!iframeLoaded && (
              <div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 sm:gap-3 bg-muted/40 backdrop-blur-sm px-4"
                aria-hidden
              >
                <Loader2 className="h-8 w-8 sm:h-9 sm:w-9 animate-spin text-primary" />
                <p className="text-xs sm:text-sm text-muted-foreground text-center">Loading virtual tour&hellip;</p>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src="/virtual-tour/index.html"
              title="FASTConnect 360° campus virtual tour"
              className="w-full block border-0 bg-[#0a1224] min-h-[220px] h-[calc(100dvh-10.5rem)] max-h-[calc(100dvh-4rem)] sm:max-h-none sm:min-h-[360px] sm:h-[70vh] md:min-h-[min(85vh,820px)]"
              allowFullScreen
              onLoad={() => setIframeLoaded(true)}
            />
          </div>

          <div className="flex flex-col gap-3 px-0.5 sm:px-1">
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              <span className="md:hidden">Use the menu (☰) in the tour&apos;s top bar for locations. Drag to look around.</span>
              <span className="hidden md:inline">
                Open the menu (top-left) to jump between locations. Drag to look around; use hotspots to move between
                scenes. Fullscreen works best for immersion.
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:flex-wrap">
              <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0" asChild>
                <a href="/virtual-tour/index.html" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2 shrink-0" />
                  Open in new tab
                </a>
              </Button>
              <Button
                variant="secondary"
                size="sm"
                type="button"
                className="w-full sm:w-auto shrink-0"
                onClick={() => {
                  const el = iframeRef.current
                  if (!el) return
                  if (document.fullscreenElement === el) {
                    void document.exitFullscreen()
                  } else {
                    void el.requestFullscreen()
                  }
                }}
              >
                <Maximize2 className="h-4 w-4 mr-2 shrink-0" />
                Fullscreen
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
