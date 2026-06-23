import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/register?role=agent')
  }

  if (user.role !== 'agent') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
