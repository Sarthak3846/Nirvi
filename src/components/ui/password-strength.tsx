"use client"

import { cn } from "@/lib/utils"
import { useMemo } from "react"

interface PasswordStrengthProps {
  password: string
  className?: string
}

export default function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const strength = useMemo(() => {
    let score = 0
    
    // Length check
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    
    return score
  }, [password])

  const getStrengthText = () => {
    if (password.length === 0) return ""
    if (strength <= 2) return "Weak"
    if (strength <= 4) return "Good"
    return "Strong"
  }

  const getStrengthColor = () => {
    if (password.length === 0) return "bg-gray-200"
    if (strength <= 2) return "bg-red-500"
    if (strength <= 4) return "bg-yellow-500"
    return "bg-green-500"
  }

  if (password.length === 0) return null

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              getStrengthColor()
            )}
            style={{ width: `${(strength / 6) * 100}%` }}
          />
        </div>
        <span className={cn(
          "text-xs font-medium",
          strength <= 2 ? "text-red-500" : strength <= 4 ? "text-yellow-600" : "text-green-600"
        )}>
          {getStrengthText()}
        </span>
      </div>
      
      <div className="text-xs text-muted-foreground">
        <div className="grid grid-cols-2 gap-0.5">
          <div className={cn(
            "flex items-center gap-1",
            password.length >= 8 ? "text-green-600" : "text-gray-400"
          )}>
            <div className={cn(
              "w-1 h-1 rounded-full",
              password.length >= 8 ? "bg-green-600" : "bg-gray-400"
            )} />
            8+ chars
          </div>
          <div className={cn(
            "flex items-center gap-1",
            /[A-Z]/.test(password) ? "text-green-600" : "text-gray-400"
          )}>
            <div className={cn(
              "w-1 h-1 rounded-full",
              /[A-Z]/.test(password) ? "bg-green-600" : "bg-gray-400"
            )} />
            Uppercase
          </div>
          <div className={cn(
            "flex items-center gap-1",
            /[a-z]/.test(password) ? "text-green-600" : "text-gray-400"
          )}>
            <div className={cn(
              "w-1 h-1 rounded-full",
              /[a-z]/.test(password) ? "bg-green-600" : "bg-gray-400"
            )} />
            Lowercase
          </div>
          <div className={cn(
            "flex items-center gap-1",
            /[0-9]/.test(password) ? "text-green-600" : "text-gray-400"
          )}>
            <div className={cn(
              "w-1 h-1 rounded-full",
              /[0-9]/.test(password) ? "bg-green-600" : "bg-gray-400"
            )} />
            Number
          </div>
        </div>
      </div>
    </div>
  )
} 