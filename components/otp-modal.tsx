"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle2, Mail } from "lucide-react"

interface OTPModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
}

export function OTPModal({ open, onOpenChange, email }: OTPModalProps) {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (open && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [open])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0]
    }

    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = [...otp]
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char
    })
    setOtp(newOtp)
  }

  const handleVerify = async () => {
    const otpString = otp.join("")
    if (otpString.length !== 6) {
      setError("Please enter the complete OTP")
      return
    }

    setIsVerifying(true)

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // For demo, accept any 6-digit code
    setIsVerifying(false)
    setIsVerified(true)

    // Redirect after success animation
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""])
    setError("")
    // Add resend logic here
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!isVerified ? (
          <>
            <DialogHeader className="text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <DialogTitle className="text-xl">Verify your email</DialogTitle>
              <DialogDescription className="text-center">
                We've sent a 6-digit verification code to{" "}
                <span className="font-medium text-foreground">{email || "your email"}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* OTP Input */}
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-lg font-semibold"
                  />
                ))}
              </div>

              {/* Error Message */}
              {error && <p className="text-sm text-destructive text-center">{error}</p>}

              {/* Verify Button */}
              <Button onClick={handleVerify} className="w-full h-11" disabled={isVerifying}>
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>

              {/* Resend */}
              <p className="text-center text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <button type="button" onClick={handleResend} className="text-primary hover:underline font-medium">
                  Resend
                </button>
              </p>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Email Verified!</h3>
            <p className="text-muted-foreground">Redirecting you to dashboard...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
