import { Suspense } from 'react'
import { Apps } from '@/features/apps'

export default function AppsPage() {
  return (
    <Suspense>
      <Apps />
    </Suspense>
  )
}

