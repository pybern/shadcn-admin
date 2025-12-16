'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  FileText,
  MapPin,
  Users,
  DollarSign,
  Package,
  ArrowLeft,
  Loader2,
  Save,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ShipmentSidebarNav } from '@/features/shipments/components/shipment-sidebar-nav'
import {
  ShipmentDetailProvider,
  useShipmentDetail,
} from '@/features/shipments/detail/shipment-detail-context'

function ShipmentDetailHeader({ shipmentId }: { shipmentId: string }) {
  const { saving, saveFunction, triggerSave } = useShipmentDetail()

  return (
    <div className='flex items-center justify-between gap-4'>
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' asChild>
          <Link href='/shipments'>
            <ArrowLeft className='h-5 w-5' />
          </Link>
        </Button>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Shipment {shipmentId}
          </h1>
          <p className='text-muted-foreground'>
            View and manage shipment details.
          </p>
        </div>
      </div>
      {saveFunction && (
        <Button onClick={triggerSave} disabled={saving}>
          {saving ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <Save className='mr-2 h-4 w-4' />
          )}
          Save Changes
        </Button>
      )}
    </div>
  )
}

function ShipmentDetailLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const shipmentId = params.id as string

  const sidebarNavItems = [
    {
      title: 'Overview',
      href: `/shipments/${shipmentId}`,
      icon: <FileText size={18} />,
    },
    {
      title: 'Contacts',
      href: `/shipments/${shipmentId}/contacts`,
      icon: <Users size={18} />,
    },
    {
      title: 'Route',
      href: `/shipments/${shipmentId}/route`,
      icon: <MapPin size={18} />,
    },
    {
      title: 'Pricing',
      href: `/shipments/${shipmentId}/pricing`,
      icon: <DollarSign size={18} />,
    },
    {
      title: 'Vehicle',
      href: `/shipments/${shipmentId}/vehicle`,
      icon: <Package size={18} />,
    },
  ]

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <ShipmentDetailHeader shipmentId={shipmentId} />
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <ShipmentSidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full overflow-y-hidden p-1'>{children}</div>
        </div>
      </Main>
    </>
  )
}

export default function ShipmentDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ShipmentDetailProvider>
      <ShipmentDetailLayoutContent>{children}</ShipmentDetailLayoutContent>
    </ShipmentDetailProvider>
  )
}
