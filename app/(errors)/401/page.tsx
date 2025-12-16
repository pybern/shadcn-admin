import { UnauthorisedError } from '@/features/errors/unauthorized-error'

export const dynamic = 'force-dynamic'

export default function UnauthorizedPage() {
  return <UnauthorisedError />
}

