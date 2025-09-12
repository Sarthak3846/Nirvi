import { cn } from "@/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "white" | "purple"
}

export default function LoadingSpinner({ 
  className, 
  size = "md", 
  variant = "default",
  ...props 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-3 h-3 border-[1.5px]",
    md: "w-4 h-4 border-2", 
    lg: "w-6 h-6 border-2"
  }

  const variantClasses = {
    default: "border-primary/30 border-t-primary",
    white: "border-white/20 border-t-white",
    purple: "border-purple-300/30 border-t-purple-400"
  }

  return (
    <div 
      className={cn(
        "rounded-full animate-spin",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
} 