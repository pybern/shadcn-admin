import { GeneralError } from '@/features/errors/general-error'

// Force dynamic rendering to avoid static export conflict
export const dynamic = 'force-dynamic'

export default function ServerErrorPage() {
  return <GeneralError />
}

