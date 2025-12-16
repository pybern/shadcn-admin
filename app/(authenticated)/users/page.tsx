'use client'

import { useSearchParams } from 'next/navigation'
import { Users } from '@/features/users'

export default function UsersPage() {
  const searchParams = useSearchParams()
  
  // Parse search params for the Users component
  const search = {
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 10,
    status: searchParams.getAll('status') as ('active' | 'inactive' | 'invited' | 'suspended')[],
    role: searchParams.getAll('role'),
    username: searchParams.get('username') || '',
  }

  return <Users />
}

