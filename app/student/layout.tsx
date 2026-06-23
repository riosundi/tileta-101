import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/register?role=student')
  }

  if (user.role !== 'student') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
