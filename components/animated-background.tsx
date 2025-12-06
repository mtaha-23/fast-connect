"use client"

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient - theme aware */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background dark:from-[#0a0a12] dark:via-[#0d0d1a] dark:to-[#0a0a12]" />

      {/* Animated wave lines - SVG pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-30" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A90E2" stopOpacity="0" />
            <stop offset="50%" stopColor="#4A90E2" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4A90E2" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wave-gradient-dark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wave-gradient-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0" />
            <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="wave-gradient-2-dark" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Wave lines - light mode */}
        <g className="animate-wave">
          {[...Array(12)].map((_, i) => (
            <path
              key={i}
              d={`M-100 ${150 + i * 60} Q ${400} ${100 + i * 60 + Math.sin(i) * 30} ${900} ${150 + i * 60} T 1900 ${150 + i * 60}`}
              fill="none"
              stroke="url(#wave-gradient)"
              strokeWidth="1"
              opacity={0.2 - i * 0.015}
              className="dark:hidden"
            />
          ))}
        </g>

        <g className="animate-wave dark:animate-wave">
          {[...Array(12)].map((_, i) => (
            <path
              key={i}
              d={`M-100 ${150 + i * 60} Q ${400} ${100 + i * 60 + Math.sin(i) * 30} ${900} ${150 + i * 60} T 1900 ${150 + i * 60}`}
              fill="none"
              stroke="url(#wave-gradient-dark)"
              strokeWidth="1"
              opacity={0.3 - i * 0.02}
              className="hidden dark:block"
            />
          ))}
        </g>

        <g className="animate-wave-slow">
          {[...Array(8)].map((_, i) => (
            <path
              key={i}
              d={`M-100 ${200 + i * 80} Q ${500} ${250 + i * 80 + Math.cos(i) * 40} ${1000} ${200 + i * 80} T 2000 ${200 + i * 80}`}
              fill="none"
              stroke="url(#wave-gradient-2)"
              strokeWidth="0.5"
              opacity={0.15 - i * 0.015}
              className="dark:hidden"
            />
          ))}
        </g>

        <g className="animate-wave-slow dark:animate-wave-slow">
          {[...Array(8)].map((_, i) => (
            <path
              key={i}
              d={`M-100 ${200 + i * 80} Q ${500} ${250 + i * 80 + Math.cos(i) * 40} ${1000} ${200 + i * 80} T 2000 ${200 + i * 80}`}
              fill="none"
              stroke="url(#wave-gradient-2-dark)"
              strokeWidth="0.5"
              opacity={0.2 - i * 0.02}
              className="hidden dark:block"
            />
          ))}
        </g>
      </svg>

      {/* Glowing orbs - theme aware */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-400/10 dark:bg-blue-600/20 blur-[120px] animate-pulse-glow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-300/8 dark:bg-indigo-600/15 blur-[100px] animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-blue-300/5 dark:bg-blue-500/10 blur-[150px] animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      />

      {/* Grid pattern overlay - theme aware */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03] hidden dark:block"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
