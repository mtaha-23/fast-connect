"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface ErrorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message: string
}

export function ErrorModal({ open, onOpenChange, title = "Error", message }: ErrorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-left">{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-2 text-left text-base">{message}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={() => onOpenChange(false)} className="min-w-[100px]">
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

