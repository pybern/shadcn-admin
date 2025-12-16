'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ShipmentsDialogs } from './components/shipments-dialogs'
import { ShipmentsPrimaryButtons } from './components/shipments-primary-buttons'
import { ShipmentsProvider } from './components/shipments-provider'
import { ShipmentsTable } from './components/shipments-table'
import { type Shipment } from './data/schema'

export function Shipments() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchShipments() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('dev_book')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100)

        if (error) throw error

        setShipments(data || [])
      } catch (err) {
        console.error('Error fetching shipments:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch shipments')
      } finally {
        setLoading(false)
      }
    }

    fetchShipments()
  }, [])

  return (
    <ShipmentsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Shipments</h2>
            <p className='text-muted-foreground'>
              Track and manage all your shipments in one place.
            </p>
          </div>
          <ShipmentsPrimaryButtons />
        </div>

        {loading ? (
          <div className='flex flex-1 items-center justify-center'>
            <Loader2 className='size-8 animate-spin text-muted-foreground' />
          </div>
        ) : error ? (
          <div className='flex flex-1 flex-col items-center justify-center gap-2'>
            <p className='text-destructive'>{error}</p>
            <p className='text-sm text-muted-foreground'>
              Please check your Supabase configuration.
            </p>
          </div>
        ) : (
          <ShipmentsTable data={shipments} />
        )}
      </Main>

      <ShipmentsDialogs />
    </ShipmentsProvider>
  )
}
