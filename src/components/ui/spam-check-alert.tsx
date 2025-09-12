"use client"

import { AlertCircle, X } from "lucide-react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SpamCheckAlertProps {
  /**
   * Email address to display in the alert
   */
  email?: string;
  /**
   * Whether the alert should be shown automatically
   * @default true
   */
  autoShow?: boolean;
  /**
   * Duration in milliseconds before the alert is automatically dismissed
   * @default 10000 (10 seconds)
   */
  autoDismissDuration?: number;
  /**
   * Optional callback when alert is dismissed
   */
  onDismiss?: () => void;
  /**
   * Optional className to apply to the alert
   */
  className?: string;
}

export function SpamCheckAlert({
  email,
  autoShow = true,
  autoDismissDuration = 10000,
  onDismiss,
  className,
}: SpamCheckAlertProps) {
  const [isVisible, setIsVisible] = useState(autoShow);

  useEffect(() => {
    if (autoShow && autoDismissDuration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoDismissDuration);

      return () => clearTimeout(timer);
    }
  }, [autoShow, autoDismissDuration, onDismiss]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "relative p-4 mb-4 rounded-md border border-yellow-500/20 bg-yellow-500/10 text-yellow-900 dark:text-yellow-200",
        className
      )}
    >
      
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-red-500">Check your spam folder</h4>
          <p className="text-xs mt-1 text-muted-foreground">
            If you don&apos;t see the email from hello@rebuildcv.com in your inbox
            {email ? ` (${email})` : ""}, please check your spam or junk folder.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 rounded-full"
          onClick={() => {
            setIsVisible(false);
            onDismiss?.();
          }}
        >
          <X className="h-3 w-3 text-red-500" />
        </Button>
      </div>
    </motion.div>
  );
}
