import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { carriers, statuses } from '../data/data'
import { type Shipment } from '../data/schema'
import { DataTableRowActions } from './data-table-row-actions'

export const shipmentsColumns: ColumnDef<Shipment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Shipment' />
    ),
    cell: ({ row }) => (
      <div className='w-[90px] font-medium'>{row.getValue('id')}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'trackingNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tracking #' />
    ),
    meta: {
      className: 'max-w-[180px]',
    },
    cell: ({ row }) => {
      const carrier = carriers.find(
        (c) => c.value === row.original.carrier
      )
      return (
        <div className='flex flex-col gap-0.5'>
          <span className='truncate font-mono text-xs'>
            {row.getValue('trackingNumber')}
          </span>
          {carrier && (
            <Badge variant='outline' className='w-fit text-xs'>
              {carrier.label}
            </Badge>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'destination',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Destination' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      return (
        <div className='flex flex-col gap-0.5'>
          <span className='text-sm'>{row.getValue('destination')}</span>
          <span className='text-xs text-muted-foreground'>
            from {row.original.origin}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-4' },
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) {
        return null
      }

      return (
        <div className='flex w-[140px] items-center gap-2'>
          {status.icon && (
            <status.icon className='size-4 text-muted-foreground' />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'carrier',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Carrier' />
    ),
    meta: { className: 'ps-1', tdClassName: 'ps-3' },
    cell: ({ row }) => {
      const carrier = carriers.find(
        (carrier) => carrier.value === row.getValue('carrier')
      )

      if (!carrier) {
        return null
      }

      return <span>{carrier.label}</span>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'weight',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Weight' />
    ),
    cell: ({ row }) => {
      const weight = row.getValue('weight') as number
      return <span>{weight.toFixed(2)} lbs</span>
    },
  },
  {
    accessorKey: 'estimatedDelivery',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Est. Delivery' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('estimatedDelivery') as Date
      return <span className='text-sm'>{format(date, 'MMM dd, yyyy')}</span>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

