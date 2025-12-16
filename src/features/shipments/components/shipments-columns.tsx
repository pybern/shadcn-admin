'use client'

import { type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { statuses } from '../data/data'
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
    accessorKey: 'ref_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => (
      <div className='w-[100px] truncate font-mono text-xs font-medium'>
        {row.getValue('ref_id')}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => {
      const email = row.getValue('email') as string | null
      if (!email) return <span className='text-muted-foreground'>-</span>
      return <span className='text-sm'>{email}</span>
    },
  },
  {
    accessorKey: 'note_l1',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    meta: {
      className: 'ps-1 max-w-0 w-2/3',
      tdClassName: 'ps-4',
    },
    cell: ({ row }) => {
      const statusValue = row.original.status
      const status = statuses.find((s) => s.value === statusValue)
      const noteL1 = row.getValue('note_l1') as string | null

      return (
        <div className='flex space-x-2'>
          {status && (
            <Badge variant='outline' className='capitalize'>
              {status.label}
            </Badge>
          )}
          <span className='truncate font-medium'>
            {noteL1 || <span className='text-muted-foreground'>-</span>}
          </span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original.status)
    },
  },
  {
    accessorKey: 'note_l2',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Notes' />
    ),
    meta: { className: 'min-w-[200px] max-w-[300px]' },
    cell: ({ row }) => {
      const noteL2 = row.getValue('note_l2') as string | null
      if (!noteL2) return <span className='text-muted-foreground'>-</span>
      return (
        <p className='line-clamp-2 text-sm text-muted-foreground'>{noteL2}</p>
      )
    },
  },
  {
    accessorKey: 'price_sell',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Price' />
    ),
    cell: ({ row }) => {
      const price = row.getValue('price_sell') as number | null
      if (price == null) return <span className='text-muted-foreground'>-</span>
      return (
        <span className='font-medium'>
          ${price.toLocaleString('en-AU', { minimumFractionDigits: 2 })}
        </span>
      )
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' />
    ),
    cell: ({ row }) => {
      const dateStr = row.getValue('created_at') as string | null
      if (!dateStr) return <span className='text-muted-foreground'>-</span>
      const date = new Date(dateStr)
      return <span className='text-sm'>{format(date, 'dd MMM yyyy')}</span>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
