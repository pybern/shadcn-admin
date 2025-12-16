'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { ShipmentsImportDialog } from './shipments-import-dialog'
import { ShipmentsMutateDrawer } from './shipments-mutate-drawer'
import { useShipments } from './shipments-provider'

export function ShipmentsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useShipments()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState(false)

  const handleDelete = async () => {
    if (!currentRow) return

    setIsDeleting(true)
    try {
      const { error } = await supabase
        .from('dev_book')
        .delete()
        .eq('ref_id', currentRow.ref_id)

      if (error) throw error

      toast.success(`Shipment ${currentRow.ref_id} has been deleted`)
      setOpen(null)
      setTimeout(() => {
        setCurrentRow(null)
      }, 500)
      window.location.reload()
    } catch (error) {
      console.error('Error deleting shipment:', error)
      toast.error('Failed to delete shipment')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDuplicate = async () => {
    if (!currentRow) return

    setIsDuplicating(true)
    try {
      // 1. Get an unallocated ref_id from dev_refs
      const { data: refData, error: refError } = await supabase
        .from('dev_refs')
        .select('id, ref_id')
        .eq('allocated', false)
        .limit(1)
        .single()

      if (refError || !refData) {
        throw new Error(
          'No available reference IDs. Please add more to dev_refs.'
        )
      }

      // 2. Mark the ref_id as allocated
      const { error: updateError } = await supabase
        .from('dev_refs')
        .update({ allocated: true })
        .eq('id', refData.id)

      if (updateError) {
        throw new Error('Failed to allocate reference ID')
      }

      // 3. Create a copy of the shipment with the new ref_id
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ref_id, created_at, ...shipmentData } = currentRow

      const { error: insertError } = await supabase.from('dev_book').insert({
        ...shipmentData,
        ref_id: refData.ref_id,
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        // If insert fails, try to rollback the allocation
        await supabase
          .from('dev_refs')
          .update({ allocated: false })
          .eq('id', refData.id)
        throw new Error('Failed to create duplicate shipment')
      }

      toast.success(`Shipment duplicated with new ID: ${refData.ref_id}`)
      setOpen(null)
      setTimeout(() => {
        setCurrentRow(null)
      }, 500)
      window.location.reload()
    } catch (error) {
      console.error('Error duplicating shipment:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to duplicate shipment'
      )
    } finally {
      setIsDuplicating(false)
    }
  }

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
            handleConfirm={handleDelete}
            isLoading={isDeleting}
            className='max-w-md'
            title={`Delete shipment ${currentRow.ref_id}?`}
            desc={
              <>
                You are about to delete the shipment with ID{' '}
                <strong>{currentRow.ref_id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />

          <ConfirmDialog
            key='shipment-duplicate'
            open={open === 'duplicate'}
            onOpenChange={() => {
              setOpen('duplicate')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={handleDuplicate}
            isLoading={isDuplicating}
            className='max-w-md'
            title={`Duplicate shipment ${currentRow.ref_id}?`}
            desc={
              <>
                You are about to create a copy of the shipment with ID{' '}
                <strong>{currentRow.ref_id}</strong>. <br />A new reference ID
                will be assigned from the available pool.
              </>
            }
            confirmText='Duplicate'
          />
        </>
      )}
    </>
  )
}
