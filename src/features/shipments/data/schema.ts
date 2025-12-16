import { z } from 'zod'

/**
 * Schema based on dev_book table
 * Used to display key shipment info
 */
export const shipmentSchema = z.object({
  // Primary identifiers
  id: z.number(),
  ref_id: z.string(),
  created_at: z.string().nullable(),

  // Customer contact info
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),

  // Pickup contact info
  pfirst_name: z.string().nullable(),
  plast_name: z.string().nullable(),
  pemail: z.string().nullable(),
  pphone: z.string().nullable(),
  pstreet: z.string().nullable(),
  pcity: z.string().nullable(),
  pstate: z.string().nullable(),
  pzip: z.string().nullable(),
  pbusiness: z.string().nullable(),

  // Delivery contact info
  dfirst_name: z.string().nullable(),
  dlast_name: z.string().nullable(),
  demail: z.string().nullable(),
  dphone: z.string().nullable(),
  dstreet: z.string().nullable(),
  dcity: z.string().nullable(),
  dstate: z.string().nullable(),
  dzip: z.string().nullable(),
  dbusiness: z.string().nullable(),

  // Route info
  from: z.string().nullable(),
  to: z.string().nullable(),
  selected_from: z.string().nullable(),
  selected_to: z.string().nullable(),
  from_desc: z.string().nullable(),
  to_desc: z.string().nullable(),

  // Vehicle info
  type: z.string().nullable(),
  v_type: z.string().nullable(),
  goods_category: z.string().nullable(),
  reg_vin: z.string().nullable(),
  color: z.string().nullable(),
  make: z.string().nullable(),
  model: z.string().nullable(),
  year: z.string().nullable(),
  car_age: z.string().nullable(),

  // Pricing
  price: z.number().nullable(),
  price_sell: z.number().nullable(),
  price_sell_cents: z.number().nullable(),
  price_fuel: z.number().nullable(),
  price_gst: z.number().nullable(),
  price_profit: z.number().nullable(),
  price_spoke_surcharge: z.number().nullable(),
  price_cc_surcharge: z.number().nullable(),
  price_customer: z.number().nullable(),
  price_customer_cents: z.number().nullable(),
  price_cost: z.number().nullable(),

  // Payment
  payid: z.string().nullable(),
  total_paid: z.number().nullable(),
  payment_method: z.string().nullable(),
  stripe_payment_id: z.string().nullable(),

  // Order tracking
  stage: z.number().nullable(),
  status: z.string().nullable(),
  order_date: z.string().nullable(),
  available_from: z.string().nullable(),
  booked_at: z.string().nullable(),
  book_ref: z.string().nullable(),
  quote_ref: z.string().nullable(),
  updated: z.string().nullable(),

  // Carrier info
  carrier: z.string().nullable(),
  carrier_type: z.string().nullable(),
  num_carriers: z.string().nullable(),
  num_carriers_type: z.string().nullable(),
  transit: z.number().nullable(),
  path: z.unknown().nullable(), // jsonb

  // Options
  door_pickup: z.boolean().nullable(),
  door_delivery: z.boolean().nullable(),
  insurance: z.boolean().nullable(),

  // Notes
  remarks: z.string().nullable(),
  note_l1: z.string().nullable(),
  note_l2: z.string().nullable(),

  // Other
  source: z.string().nullable(),
  rn1: z.string().nullable(),
  rn2: z.string().nullable(),
})

export type Shipment = z.infer<typeof shipmentSchema>
