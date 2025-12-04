interface CircularProgressProps {
  percentage: number
  status: string
  size?: "sm" | "md" | "lg"
}

const sizeMap = {
  sm: "w-10 h-10 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-14 h-14 text-sm"
}

export function CircularProgress({ percentage, status, size = "lg" }: CircularProgressProps) {
  // Status color mapping
  const statusColorMap: Record<string, string> = {
    completed: "text-green-500",
    pending: "text-yellow-500",
    inprogress: "text-blue-500",
    partially_completed: "text-orange-500",
    failed: "text-red-500"
  }

  const color = statusColorMap[status.toLowerCase()] || "text-gray-500"
  const rotation = (percentage / 100) * 360

  // Determine display value
  const displayPercentage = percentage % 1 === 0 
    ? percentage // Whole number
    : percentage.toFixed(2); // Decimal value

  return (
    <div className={`relative ${sizeMap[size]} flex items-center justify-center`}>
      {/* Background circle */}
      <div className="absolute inset-0 rounded-full bg-gray-300" />
      
      {/* Progress circle */}
      <div 
        className={`absolute inset-0 rounded-full ${color}`}
        style={{
          background: `conic-gradient(currentColor ${rotation}deg, transparent ${rotation}deg)`
        }}
      />
      
      {/* Inner white circle */}
      <div className="absolute inset-[3px] rounded-full bg-white" />
      
      {/* Percentage text */}
      <span className={`relative font-medium ${color}`}>
        {displayPercentage}%
      </span>
    </div>
  )
}

