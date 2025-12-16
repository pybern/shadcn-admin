import { ForbiddenError } from '@/features/errors/forbidden'

export const dynamic = 'force-dynamic'

export default function ForbiddenPage() {
  return <ForbiddenError />
}

