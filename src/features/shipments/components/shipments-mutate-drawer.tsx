'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SelectDropdown } from '@/components/select-dropdown'
import { type Shipment } from '../data/schema'

type ShipmentMutateDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Shipment
}

const formSchema = z.object({
  trackingNumber: z.string().min(1, 'Tracking number is required.'),
  origin: z.string().min(1, 'Origin is required.'),
  destination: z.string().min(1, 'Destination is required.'),
  carrier: z.string().min(1, 'Please select a carrier.'),
  status: z.string().min(1, 'Please select a status.'),
  weight: z.string().min(1, 'Weight is required.'),
})
type ShipmentForm = z.infer<typeof formSchema>

export function ShipmentsMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: ShipmentMutateDrawerProps) {
  const isUpdate = !!currentRow

  const form = useForm<ShipmentForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? {
          trackingNumber: currentRow.trackingNumber,
          origin: currentRow.origin,
          destination: currentRow.destination,
          carrier: currentRow.carrier,
          status: currentRow.status,
          weight: String(currentRow.weight),
        }
      : {
          trackingNumber: '',
          origin: '',
          destination: '',
          carrier: '',
          status: '',
          weight: '',
        },
  })

  const onSubmit = (data: ShipmentForm) => {
    onOpenChange(false)
    form.reset()
    showSubmittedData(data)
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
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Shipment</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the shipment by providing necessary info.'
              : 'Add a new shipment by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='shipments-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='trackingNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracking Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter tracking number' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='origin'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origin</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter origin city' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='destination'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter destination city' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='carrier'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carrier</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select carrier'
                    items={[
                      { label: 'FedEx', value: 'fedex' },
                      { label: 'UPS', value: 'ups' },
                      { label: 'DHL', value: 'dhl' },
                      { label: 'USPS', value: 'usps' },
                      { label: 'Amazon Logistics', value: 'amazon' },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    items={[
                      { label: 'Pending', value: 'pending' },
                      { label: 'Processing', value: 'processing' },
                      { label: 'In Transit', value: 'in transit' },
                      { label: 'Out for Delivery', value: 'out for delivery' },
                      { label: 'Delivered', value: 'delivered' },
                      { label: 'Failed Delivery', value: 'failed' },
                      { label: 'Returned', value: 'returned' },
                      { label: 'Exception', value: 'exception' },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='weight'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (lbs)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type='number'
                      step='0.01'
                      placeholder='Enter weight'
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

