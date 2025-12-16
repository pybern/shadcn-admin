import { Suspense } from 'react'
import { Shipments } from '@/features/shipments'

export default function ShipmentsPage() {
  return (
    <Suspense>
      <Shipments />
    </Suspense>
  )
}

