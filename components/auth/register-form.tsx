"use client"

import { useState, useTransition } from "react"
import { ShoppingBag, Bike, Store, ShieldCheck } from "lucide-react"
import { registerUser } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { Role } from "@/lib/types"

const roleOptions: { value: Role; label: string; icon: typeof ShoppingBag }[] = [
  { value: "student", label: "Student", icon: ShoppingBag },
  { value: "agent", label: "Delivery Agent", icon: Bike },
  { value: "business", label: "Business", icon: Store },
  { value: "admin", label: "Admin", icon: ShieldCheck },
]

export function RegisterForm({ defaultRole }: { defaultRole?: string }) {
  const [role, setRole] = useState<Role>(
    (["student", "agent", "business", "admin"].includes(defaultRole || "")
      ? defaultRole
      : "student") as Role,
  )
  const [pending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.set("role", role)

    startTransition(async () => {
      const res = await registerUser(formData)
      if (res?.error) toast.error(res.error)
    })
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-5">
      <div className="space-y-2">
        <Label>I am a</Label>
        <div className="grid grid-cols-2 gap-2">
          {roleOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setRole(opt.value)}
              className={cn(
                "flex items-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all",
                role === opt.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "hover:border-primary/40",
              )}
            >
              <opt.icon className="h-4 w-4" />
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          placeholder="e.g. Ada Obi"
          required
          autoComplete="name"
        />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}
