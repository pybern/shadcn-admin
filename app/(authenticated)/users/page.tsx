import { Suspense } from 'react'
import { Users } from '@/features/users'

export default function UsersPage() {
  return (
    <Suspense>
      <Users />
    </Suspense>
  )
}

