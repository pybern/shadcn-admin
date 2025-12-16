'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { SelectDropdown } from '@/components/select-dropdown'
import { statuses } from '../data/data'
import { type Shipment } from '../data/schema'

type ShipmentMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Shipment
}

const formSchema = z.object({
  status: z.string().min(1, 'Please select a status.'),
  email: z.string().email('Please enter a valid email.').optional().or(z.literal('')),
  from: z.string().optional(),
  to: z.string().optional(),
  price_sell: z.coerce.number().nullable().optional(),
  note_l1: z.string().optional(),
  note_l2: z.string().optional(),
})
type ShipmentForm = z.infer<typeof formSchema>

export function ShipmentsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: ShipmentMutateDrawerProps) {
  const isUpdate = !!currentRow
  const [isSendingEmail, setIsSendingEmail] = useState(false)

  const form = useForm<ShipmentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: '',
      email: '',
      from: '',
      to: '',
      price_sell: null,
      note_l1: '',
      note_l2: '',
    },
  })

  // Reset form when currentRow changes
  useEffect(() => {
    if (currentRow) {
      form.reset({
        status: currentRow.status || 'pending',
        email: currentRow.email || '',
        from: currentRow.from || '',
        to: currentRow.to || '',
        price_sell: currentRow.price_sell ?? null,
        note_l1: currentRow.note_l1 || '',
        note_l2: currentRow.note_l2 || '',
      })
    } else {
      form.reset({
        status: 'pending',
        email: '',
        from: '',
        to: '',
        price_sell: null,
        note_l1: '',
        note_l2: '',
      })
    }
  }, [currentRow, form])

  const onSubmit = async (data: ShipmentForm) => {
    if (!currentRow) return

    try {
      const { error } = await supabase
        .from('dev_book')
        .update({
          status: data.status,
          email: data.email || null,
          from: data.from || null,
          to: data.to || null,
          price_sell: data.price_sell,
          note_l1: data.note_l1 || null,
          note_l2: data.note_l2 || null,
        })
        .eq('ref_id', currentRow.ref_id)

      if (error) throw error

      toast.success('Shipment updated successfully')
      onOpenChange(false)
      form.reset()
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error updating shipment:', error)
      toast.error('Failed to update shipment')
    }
  }

  const sendTestEmail = async () => {
    const email = form.getValues('email')
    if (!email) {
      toast.error('Please enter an email address first')
      return
    }

    if (!currentRow) return

    setIsSendingEmail(true)
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          shipmentId: currentRow.ref_id,
          shipmentDetails: {
            ref_id: currentRow.ref_id,
            status: form.getValues('status'),
            from: form.getValues('from'),
            to: form.getValues('to'),
            price_sell: form.getValues('price_sell'),
            note_l1: form.getValues('note_l1'),
            note_l2: form.getValues('note_l2'),
          },
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email')
      }

      toast.success(`Test email sent to ${email}`)
    } catch (error) {
      console.error('Error sending email:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to send email'
      )
    } finally {
      setIsSendingEmail(false)
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>
            {isUpdate ? 'Shipment Details' : 'Create Shipment'}
          </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update shipment details below.'
              : 'Add a new shipment.'}
          </SheetDescription>
        </SheetHeader>

        {currentRow && (
          <div className='space-y-2 px-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-muted-foreground'>
                Reference ID
              </span>
              <span className='font-mono text-sm font-semibold'>
                {currentRow.ref_id}
              </span>
            </div>
            <Separator />
          </div>
        )}

        <Form {...form}>
          <form
            id='shipments-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-5 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select status'
                    items={statuses.map((s) => ({
                      label: s.label,
                      value: s.value,
                    }))}
                  />
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
                  <div className='flex gap-2'>
                    <FormControl>
                      <Input
                        {...field}
                        type='email'
                        placeholder='Enter email address...'
                      />
                    </FormControl>
                    {isUpdate && (
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={sendTestEmail}
                        disabled={isSendingEmail}
                        title='Send test email'
                      >
                        {isSendingEmail ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          <Send className='h-4 w-4' />
                        )}
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='from'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Origin...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='to'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Destination...' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='price_sell'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.01'
                      placeholder='Enter price...'
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value === '' ? null : Number(value))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='note_l1'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (Note L1)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='Enter title or primary note...'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='note_l2'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Note L2)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='Enter additional notes...'
                      className='min-h-[100px] resize-none'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='shipments-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
