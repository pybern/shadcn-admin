import { type NextRequest, NextResponse } from 'next/server'

export function middleware(_request: NextRequest) {
  // Simple middleware that just continues for all routes
  // Clerk protection is handled at the layout/page level instead
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  ],
}
