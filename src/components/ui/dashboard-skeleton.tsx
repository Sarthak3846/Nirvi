import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function DashboardWelcomeSkeleton() {
  return (
    <Card className="p-6 mb-8 border border-border bg-card/50 backdrop-blur-sm">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-80" />
    </Card>
  )
}

export function DashboardResumesSkeleton() {
  return (
    <Card className="p-4 border border-border bg-card/50 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ResumeCardSkeleton key={i} />
        ))}
      </div>
    </Card>
  )
}

export function ResumeCardSkeleton() {
  return (
    <div className="h-full flex flex-col justify-between border border-border bg-card/90 rounded-lg overflow-hidden shadow-md">
      <div className="flex items-start p-4">
        <div className="flex-shrink-0 mr-3">
          <Skeleton className="w-8 h-10 rounded" />
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-5 w-5 rounded" />
      </div>
      
      <div className="border-t border-border pt-2">
        <div className="px-4 pb-2">
          <Skeleton className="h-3 w-12 mb-1" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="px-4 pb-4">
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="px-4 pb-4 flex justify-end">
          <Skeleton className="h-8 w-24 rounded" />
        </div>
      </div>
    </div>
  )
}

export function DashboardMainSkeleton() {
  return (
    <div className="flex flex-col flex-1 min-h-screen bg-background text-foreground">
      <div className="container mx-auto py-8 space-y-8">
        <DashboardWelcomeSkeleton />
        <DashboardResumesSkeleton />
      </div>
    </div>
  )
}

export function EmptyStateWithSkeleton() {
  return (
    <Card className="p-4 border border-border bg-card/50 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>
      
      <div className="text-center p-8 border border-dashed rounded-lg">
        <Skeleton className="h-6 w-40 mx-auto mb-4" />
        <Skeleton className="h-4 w-64 mx-auto mb-4" />
        <Skeleton className="h-10 w-36 mx-auto" />
      </div>
    </Card>
  )
}

// Billing page skeletons
export function BillingPageSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-80" />
      </div>
      
      <div className="grid gap-6">
        {/* Subscription Details Skeleton */}
        <Card className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-64" />
          </div>
        </Card>
        
        {/* Credits and Plans Skeleton */}
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-5 w-20 mb-2" />
                <Skeleton className="h-6 w-16" />
              </Card>
            ))}
          </div>
        </Card>
        
        {/* Transaction History Skeleton */}
        <Card className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// Create Resume page skeleton
export function CreateResumePageSkeleton() {
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-80" />
      </div>
      
      <div className="max-w-xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <div className="border rounded-lg p-4">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </div>
    </div>
  )
}

// Loading spinner component for buttons
export function LoadingSpinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
} 