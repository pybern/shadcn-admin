import type { Metadata, Viewport } from 'next'
import { Suspense } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import { Providers } from './providers'
import '@/styles/index.css'

export const metadata: Metadata = {
  title: 'Shadcn Admin',
  description: 'Admin Dashboard UI built with Shadcn and Next.js.',
  openGraph: {
    type: 'website',
    url: 'https://shadcn-admin.netlify.app',
    title: 'Shadcn Admin',
    description: 'Admin Dashboard UI built with Shadcn and Next.js.',
    images: [
      {
        url: 'https://shadcn-admin.netlify.app/images/shadcn-admin.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shadcn Admin',
    description: 'Admin Dashboard UI built with Shadcn and Next.js.',
    images: ['https://shadcn-admin.netlify.app/images/shadcn-admin.png'],
  },
  icons: {
    icon: [
      {
        url: '/images/favicon.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/images/favicon_light.svg',
        type: 'image/svg+xml',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/images/favicon.png',
        type: 'image/png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/images/favicon_light.png',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: '#fff',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <Providers>
          {children}
        </Providers>
        <Toaster duration={5000} />
      </body>
    </html>
  )
}

