'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { statuses } from '../data/data'
import { type Shipment } from '../data/schema'

export function ShipmentOverview() {
  const params = useParams()
  const shipmentId = params.id as string
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    async function fetchShipment() {
      try {
        const { data, error } = await supabase
          .from('dev_book')
          .select('*')
          .eq('ref_id', shipmentId)
          .single()

        if (error) throw error
        setShipment(data)
      } catch (error) {
        console.error('Error fetching shipment:', error)
        toast.error('Failed to load shipment details')
      } finally {
        setLoading(false)
      }
    }

    fetchShipment()
  }, [shipmentId])

  const sendEmail = async () => {
    if (!shipment?.email) {
      toast.error('No email address available')
      return
    }

    setSendingEmail(true)
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: shipment.email,
          shipmentId: shipment.ref_id,
          shipmentDetails: shipment,
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error)

      toast.success(`Email sent to ${shipment.email}`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to send email'
      )
    } finally {
      setSendingEmail(false)
    }
  }

  if (loading) {
    return (
      <div className='flex h-64 w-full items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
      </div>
    )
  }

  if (!shipment) {
    return (
      <div className='flex h-64 w-full items-center justify-center'>
        <p className='text-muted-foreground'>Shipment not found</p>
      </div>
    )
  }

  const status = statuses.find((s) => s.value === shipment.status)

  return (
    <div className='flex flex-1 flex-col'>
      {/* Header */}
      <div className='flex flex-none items-center justify-between'>
        <div>
          <h3 className='text-lg font-medium'>Overview</h3>
          <p className='text-sm text-muted-foreground'>
            General shipment information
          </p>
        </div>
        {shipment.email && (
          <Button
            variant='outline'
            size='sm'
            onClick={sendEmail}
            disabled={sendingEmail}
          >
            {sendingEmail ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Send className='mr-2 h-4 w-4' />
            )}
            Send Email
          </Button>
        )}
      </div>

      <Separator className='my-4 flex-none' />

      {/* Content */}
      <div className='faded-bottom h-full w-full space-y-6 overflow-y-auto scroll-smooth pe-4 pb-12'>
        {/* Status & Reference */}
        <div className='flex flex-wrap items-center gap-4'>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>
              Reference ID
            </p>
            <p className='font-mono text-lg font-semibold'>{shipment.ref_id}</p>
          </div>
          <Separator orientation='vertical' className='h-10' />
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Status</p>
            {status && (
              <Badge variant='outline' className='mt-1 capitalize'>
                {status.label}
              </Badge>
            )}
          </div>
          <Separator orientation='vertical' className='h-10' />
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Created</p>
            <p className='text-sm'>
              {shipment.created_at
                ? format(new Date(shipment.created_at), 'dd MMM yyyy, HH:mm')
                : '-'}
            </p>
          </div>
        </div>

        <Separator />

        {/* Notes Section */}
        <div className='grid gap-4 md:grid-cols-2'>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Title</p>
            <p className='mt-1'>{shipment.note_l1 || '-'}</p>
          </div>
          <div>
            <p className='text-sm font-medium text-muted-foreground'>Notes</p>
            <p className='mt-1 whitespace-pre-wrap'>
              {shipment.note_l2 || '-'}
            </p>
          </div>
        </div>

        <Separator />

        {/* Route Information */}
        <div>
          <h4 className='mb-3 text-sm font-semibold'>Route</h4>
          <div className='grid gap-4 md:grid-cols-2'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>From</p>
              <p className='mt-1'>{shipment.from || '-'}</p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>To</p>
              <p className='mt-1'>{shipment.to || '-'}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Pricing */}
        <div>
          <h4 className='mb-3 text-sm font-semibold'>Pricing</h4>
          <div className='grid gap-4 md:grid-cols-3'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Sell Price
              </p>
              <p className='mt-1 text-lg font-semibold'>
                {shipment.price_sell != null
                  ? `$${shipment.price_sell.toLocaleString('en-AU', { minimumFractionDigits: 2 })}`
                  : '-'}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Cost Price
              </p>
              <p className='mt-1'>
                {shipment.price_cost != null
                  ? `$${shipment.price_cost.toLocaleString('en-AU', { minimumFractionDigits: 2 })}`
                  : '-'}
              </p>
            </div>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Total Paid
              </p>
              <p className='mt-1'>
                {shipment.total_paid != null
                  ? `$${shipment.total_paid.toLocaleString('en-AU', { minimumFractionDigits: 2 })}`
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

