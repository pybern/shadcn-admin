'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { type Shipment } from '../data/schema'
import { useShipmentDetail } from './shipment-detail-context'

const contactsFormSchema = z.object({
  // Customer
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  // Pickup
  pfirst_name: z.string().optional(),
  plast_name: z.string().optional(),
  pemail: z.string().email().optional().or(z.literal('')),
  pphone: z.string().optional(),
  pbusiness: z.string().optional(),
  pstreet: z.string().optional(),
  pcity: z.string().optional(),
  pstate: z.string().optional(),
  pzip: z.string().optional(),
  // Dropoff
  dfirst_name: z.string().optional(),
  dlast_name: z.string().optional(),
  demail: z.string().email().optional().or(z.literal('')),
  dphone: z.string().optional(),
  dbusiness: z.string().optional(),
  dstreet: z.string().optional(),
  dcity: z.string().optional(),
  dstate: z.string().optional(),
  dzip: z.string().optional(),
})

type ContactsFormValues = z.infer<typeof contactsFormSchema>

export function ShipmentContacts() {
  const params = useParams()
  const shipmentId = params.id as string
  const [shipment, setShipment] = useState<Shipment | null>(null)
  const [loading, setLoading] = useState(true)
  const { setSaving, registerSaveFunction } = useShipmentDetail()

  const form = useForm<ContactsFormValues>({
    resolver: zodResolver(contactsFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      pfirst_name: '',
      plast_name: '',
      pemail: '',
      pphone: '',
      pbusiness: '',
      pstreet: '',
      pcity: '',
      pstate: '',
      pzip: '',
      dfirst_name: '',
      dlast_name: '',
      demail: '',
      dphone: '',
      dbusiness: '',
      dstreet: '',
      dcity: '',
      dstate: '',
      dzip: '',
    },
  })

  const onSubmit = useCallback(
    async (data: ContactsFormValues) => {
      setSaving(true)
      try {
        const { error } = await supabase
          .from('dev_book')
          .update({
            first_name: data.first_name || null,
            last_name: data.last_name || null,
            email: data.email || null,
            phone: data.phone || null,
            pfirst_name: data.pfirst_name || null,
            plast_name: data.plast_name || null,
            pemail: data.pemail || null,
            pphone: data.pphone || null,
            pbusiness: data.pbusiness || null,
            pstreet: data.pstreet || null,
            pcity: data.pcity || null,
            pstate: data.pstate || null,
            pzip: data.pzip || null,
            dfirst_name: data.dfirst_name || null,
            dlast_name: data.dlast_name || null,
            demail: data.demail || null,
            dphone: data.dphone || null,
            dbusiness: data.dbusiness || null,
            dstreet: data.dstreet || null,
            dcity: data.dcity || null,
            dstate: data.dstate || null,
            dzip: data.dzip || null,
          })
          .eq('ref_id', shipmentId)

        if (error) throw error

        toast.success('Contacts updated successfully')
      } catch (error) {
        console.error('Error updating contacts:', error)
        toast.error('Failed to update contacts')
      } finally {
        setSaving(false)
      }
    },
    [shipmentId, setSaving]
  )

  // Register save function with context
  useEffect(() => {
    const handleSave = async () => {
      await form.handleSubmit(onSubmit)()
    }
    registerSaveFunction(handleSave)

    return () => {
      registerSaveFunction(null)
    }
  }, [form, onSubmit, registerSaveFunction])

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

        // Populate form with fetched data
        form.reset({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          pfirst_name: data.pfirst_name || '',
          plast_name: data.plast_name || '',
          pemail: data.pemail || '',
          pphone: data.pphone || '',
          pbusiness: data.pbusiness || '',
          pstreet: data.pstreet || '',
          pcity: data.pcity || '',
          pstate: data.pstate || '',
          pzip: data.pzip || '',
          dfirst_name: data.dfirst_name || '',
          dlast_name: data.dlast_name || '',
          demail: data.demail || '',
          dphone: data.dphone || '',
          dbusiness: data.dbusiness || '',
          dstreet: data.dstreet || '',
          dcity: data.dcity || '',
          dstate: data.dstate || '',
          dzip: data.dzip || '',
        })
      } catch (error) {
        console.error('Error fetching shipment:', error)
        toast.error('Failed to load shipment details')
      } finally {
        setLoading(false)
      }
    }

    fetchShipment()
  }, [shipmentId, form])

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

  return (
    <Form {...form}>
      <form className='flex flex-1 flex-col'>
        {/* Header */}
        <div className='flex-none'>
          <h3 className='text-lg font-medium'>Contacts</h3>
          <p className='text-sm text-muted-foreground'>
            Customer, pickup, and dropoff contact details
          </p>
        </div>

        <Separator className='my-4 flex-none' />

        {/* Content */}
        <div className='faded-bottom h-full w-full space-y-6 overflow-y-auto scroll-smooth pe-4 pb-12'>
          {/* Customer Contact */}
          <div>
            <h4 className='mb-3 text-sm font-semibold'>Customer</h4>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <FormField
                control={form.control}
                name='first_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder='First name...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='last_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Last name...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Email address...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder='Phone number...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Pickup Contact */}
          <div>
            <h4 className='mb-3 text-sm font-semibold'>Pickup Contact</h4>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <FormField
                control={form.control}
                name='pfirst_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder='First name...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='plast_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Last name...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pemail'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Email address...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pphone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder='Phone number...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pbusiness'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business</FormLabel>
                    <FormControl>
                      <Input placeholder='Business name...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pstreet'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input placeholder='Street address...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='pcity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder='City...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='pstate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder='State...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='pzip'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postcode</FormLabel>
                      <FormControl>
                        <Input placeholder='Postcode...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Dropoff Contact */}
          <div>
            <h4 className='mb-3 text-sm font-semibold'>Dropoff Contact</h4>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <FormField
                control={form.control}
                name='dfirst_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder='First name...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='dlast_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Last name...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='demail'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type='email'
                        placeholder='Email address...'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='dphone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder='Phone number...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='dbusiness'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business</FormLabel>
                    <FormControl>
                      <Input placeholder='Business name...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='dstreet'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street</FormLabel>
                    <FormControl>
                      <Input placeholder='Street address...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='dcity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder='City...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='dstate'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder='State...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='dzip'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postcode</FormLabel>
                      <FormControl>
                        <Input placeholder='Postcode...' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
