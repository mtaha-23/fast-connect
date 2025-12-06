"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

interface OTPModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  email: string
}

export function OTPModal({ open, onOpenChange, email }: OTPModalProps) {
  const router = useRouter()

  const handleContinue = () => {
    // Close modal and redirect to login page immediately
    onOpenChange(false)
    router.push("/login")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Mail className="w-7 h-7 text-primary" />
          </div>
          <DialogTitle className="text-xl">Check your email</DialogTitle>
          <DialogDescription className="text-center">
            We've sent a verification link to{" "}
            <span className="font-medium text-foreground">{email || "your email"}</span>. Click the link in your
            inbox to verify your account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Button onClick={handleContinue} className="w-full h-11">
            Sign in
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            You can close this window after verifying. If you don't see the email, check your spam folder.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
