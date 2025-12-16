'use client'

import { useState } from 'react'
import { AxiosError } from 'axios'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { handleServerError } from '@/lib/handle-server-error'
import { DirectionProvider } from '@/context/direction-provider'
import { FontProvider } from '@/context/font-provider'
import { ThemeProvider } from '@/context/theme-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              // eslint-disable-next-line no-console
              if (process.env.NODE_ENV === 'development') console.log({ failureCount, error })

              if (failureCount >= 0 && process.env.NODE_ENV === 'development') return false
              if (failureCount > 3 && process.env.NODE_ENV === 'production') return false

              return !(
                error instanceof AxiosError &&
                [401, 403].includes(error.response?.status ?? 0)
              )
            },
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            staleTime: 10 * 1000, // 10s
          },
          mutations: {
            onError: (error) => {
              handleServerError(error)

              if (error instanceof AxiosError) {
                if (error.response?.status === 304) {
                  toast.error('Content not modified!')
                }
              }
            },
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof AxiosError) {
              if (error.response?.status === 401) {
                toast.error('Session expired!')
                useAuthStore.getState().auth.reset()
                const redirect = window.location.pathname
                router.push(`/sign-in?redirect=${encodeURIComponent(redirect)}`)
              }
              if (error.response?.status === 500) {
                toast.error('Internal Server Error!')
                // Only navigate to error page in production to avoid disrupting HMR in development
                if (process.env.NODE_ENV === 'production') {
                  router.push('/500')
                }
              }
            }
          },
        }),
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <FontProvider>
          <DirectionProvider>
            {children}
          </DirectionProvider>
        </FontProvider>
      </ThemeProvider>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools buttonPosition='bottom-left' />
      )}
    </QueryClientProvider>
  )
}

