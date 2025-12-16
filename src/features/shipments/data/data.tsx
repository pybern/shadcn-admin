import {
  Truck,
  Package,
  PackageCheck,
  PackageX,
  Clock,
  CircleAlert,
  RotateCcw,
  Warehouse,
} from 'lucide-react'

export const statuses = [
  {
    label: 'Pending',
    value: 'pending' as const,
    icon: Clock,
  },
  {
    label: 'Confirmed',
    value: 'confirmed' as const,
    icon: Warehouse,
  },
  {
    label: 'Picked Up',
    value: 'picked_up' as const,
    icon: Package,
  },
  {
    label: 'In Transit',
    value: 'in_transit' as const,
    icon: Truck,
  },
  {
    label: 'Delivered',
    value: 'delivered' as const,
    icon: PackageCheck,
  },
  {
    label: 'Cancelled',
    value: 'cancelled' as const,
    icon: PackageX,
  },
  {
    label: 'Refunded',
    value: 'refunded' as const,
    icon: RotateCcw,
  },
  {
    label: 'Issue',
    value: 'issue' as const,
    icon: CircleAlert,
  },
]

export const vehicleTypes = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'truck', label: 'Truck' },
  { value: 'van', label: 'Van' },
  { value: 'motorcycle', label: 'Motorcycle' },
  { value: 'other', label: 'Other' },
]
