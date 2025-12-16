'use client'

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
import { shipments } from './data/shipments'

export function Shipments() {
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
        <ShipmentsTable data={shipments} />
      </Main>

      <ShipmentsDialogs />
    </ShipmentsProvider>
  )
}

