import { z } from 'zod'

export const shipmentSchema = z.object({
  id: z.string(),
  trackingNumber: z.string(),
  status: z.string(),
  carrier: z.string(),
  origin: z.string(),
  destination: z.string(),
  weight: z.number(),
  estimatedDelivery: z.date(),
  createdAt: z.date(),
})

export type Shipment = z.infer<typeof shipmentSchema>

