function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-2xl bg-moss/10 ${className}`} aria-hidden="true" />
}

export function SkeletonText({ className = '' }) {
  return <Skeleton className={`h-4 ${className}`} />
}

export function SkeletonCard({ className = '' }) {
  return <Skeleton className={`min-h-32 ${className}`} />
}

export default Skeleton
