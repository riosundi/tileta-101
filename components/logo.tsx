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
      <path d="M7 9h25v8H23v24h-9V17H7V9Z" fill="currentColor" />
      <path d="M28 9h13v9H35L23 41h-9L28 9Z" fill="currentColor" />
      <path d="m25 18 9-5v9l-5 3-4-7Z" className="text-primary" fill="currentColor" />
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
