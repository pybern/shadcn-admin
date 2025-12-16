'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

type ShipmentDetailContextType = {
  saving: boolean
  setSaving: (saving: boolean) => void
  saveFunction: (() => Promise<void>) | null
  registerSaveFunction: (fn: (() => Promise<void>) | null) => void
  triggerSave: () => Promise<void>
}

const ShipmentDetailContext = createContext<ShipmentDetailContextType | null>(
  null
)

export function ShipmentDetailProvider({ children }: { children: ReactNode }) {
  const [saving, setSaving] = useState(false)
  const [saveFunction, setSaveFunction] = useState<
    (() => Promise<void>) | null
  >(null)

  const registerSaveFunction = useCallback(
    (fn: (() => Promise<void>) | null) => {
      setSaveFunction(() => fn)
    },
    []
  )

  const triggerSave = useCallback(async () => {
    if (saveFunction) {
      await saveFunction()
    }
  }, [saveFunction])

  return (
    <ShipmentDetailContext.Provider
      value={{
        saving,
        setSaving,
        saveFunction,
        registerSaveFunction,
        triggerSave,
      }}
    >
      {children}
    </ShipmentDetailContext.Provider>
  )
}

export function useShipmentDetail() {
  const context = useContext(ShipmentDetailContext)
  if (!context) {
    throw new Error(
      'useShipmentDetail must be used within a ShipmentDetailProvider'
    )
  }
  return context
}

