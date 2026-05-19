function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-moss/10 ${className}`} aria-hidden="true" />
}

export function SkeletonText({ className = '' }) {
  return <Skeleton className={`h-4 ${className}`} />
}

export function SkeletonCard({ className = '' }) {
  return <Skeleton className={`min-h-32 ${className}`} />
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <SkeletonText className="w-36" />
      <Skeleton className="mt-4 h-14 w-full max-w-xl" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <SkeletonCard className="mt-8 min-h-72" />
    </div>
  )
}

export default Skeleton
