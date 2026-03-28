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


        </div>
      </div>
    </div>
  )
}
