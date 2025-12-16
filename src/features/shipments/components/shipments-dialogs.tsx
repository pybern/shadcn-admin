import { showSubmittedData } from '@/lib/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { ShipmentsImportDialog } from './shipments-import-dialog'
import { ShipmentsMutateDrawer } from './shipments-mutate-drawer'
import { useShipments } from './shipments-provider'

export function ShipmentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useShipments()
  return (
    <>
      <ShipmentsMutateDrawer
        key='shipment-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <ShipmentsImportDialog
        key='shipments-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <ShipmentsMutateDrawer
            key={`shipment-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='shipment-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              showSubmittedData(
                currentRow,
                'The following shipment has been deleted:'
              )
            }}
            className='max-w-md'
            title={`Delete this shipment: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a shipment with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}

