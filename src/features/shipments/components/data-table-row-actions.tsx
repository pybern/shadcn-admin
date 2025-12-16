import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { Trash2, SquarePen, Copy, CopyPlus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { shipmentSchema } from '../data/schema'
import { useShipments } from './shipments-provider'

type DataTableRowActionsProps<TData> = {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const shipment = shipmentSchema.parse(row.original)

  const { setOpen, setCurrentRow } = useShipments()

  const handleCopyRefId = () => {
    navigator.clipboard.writeText(shipment.ref_id)
    toast.success('Reference ID copied to clipboard')
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(shipment)
            setOpen('update')
          }}
        >
          <SquarePen className='mr-2 h-4 w-4' />
          Quick Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyRefId}>
          <Copy className='mr-2 h-4 w-4' />
          Copy Ref ID
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(shipment)
            setOpen('duplicate')
          }}
        >
          <CopyPlus className='mr-2 h-4 w-4' />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(shipment)
            setOpen('delete')
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
