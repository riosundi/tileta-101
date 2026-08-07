import { cn } from "@/lib/utils"

function TiletaMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-8 w-8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 7h25v7H19v26h-8V14H5V7Z" fill="currentColor" />
      <path d="m27 7 16 8v9l-7-3-12 19H15l13-22-7-3 6-8Z" fill="currentColor" />
      <path d="m22 17 9-5v8l-5 3-4-6Z" className="text-accent" fill="currentColor" />
      <path d="m25 23 5-3 4 2-5 3-4-2Z" className="text-accent/80" fill="currentColor" />
    </svg>
  )
}

export function Logo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
        <TiletaMark />
      </div>
      {showText && (
        <span className="text-xl font-bold tracking-tight">
          TILE<span className="brand-gradient-text">TA</span>
        </span>
      )}
    </div>
  )
}
