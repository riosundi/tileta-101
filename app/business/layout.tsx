import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/register?role=business')
  }

  if (user.role !== 'business') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
