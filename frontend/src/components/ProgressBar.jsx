function ProgressBar({ value, className = 'h-2', trackClassName = 'bg-moss/10', barClassName = 'bg-leaf-600' }) {
  const safeValue = Math.min(Math.max(value, 0), 100)

  return (
    <div className={`${className} overflow-hidden rounded-full ${trackClassName}`}>
      <div className={`h-full rounded-full transition-all duration-300 ${barClassName}`} style={{ width: `${safeValue}%` }} />
    </div>
  )
}

export default ProgressBar
