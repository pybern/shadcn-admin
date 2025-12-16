import {
  Truck,
  Package,
  PackageCheck,
  PackageX,
  Clock,
  Plane,
  Ship,
  CircleAlert,
  RotateCcw,
  Warehouse,
} from 'lucide-react'

export const carriers = [
  {
    value: 'fedex',
    label: 'FedEx',
  },
  {
    value: 'ups',
    label: 'UPS',
  },
  {
    value: 'dhl',
    label: 'DHL',
  },
  {
    value: 'usps',
    label: 'USPS',
  },
  {
    value: 'amazon',
    label: 'Amazon Logistics',
  },
]

export const statuses = [
  {
    label: 'Pending',
    value: 'pending' as const,
    icon: Clock,
  },
  {
    label: 'Processing',
    value: 'processing' as const,
    icon: Warehouse,
  },
  {
    label: 'In Transit',
    value: 'in transit' as const,
    icon: Truck,
  },
  {
    label: 'Out for Delivery',
    value: 'out for delivery' as const,
    icon: Package,
  },
  {
    label: 'Delivered',
    value: 'delivered' as const,
    icon: PackageCheck,
  },
  {
    label: 'Failed Delivery',
    value: 'failed' as const,
    icon: PackageX,
  },
  {
    label: 'Returned',
    value: 'returned' as const,
    icon: RotateCcw,
  },
  {
    label: 'Exception',
    value: 'exception' as const,
    icon: CircleAlert,
  },
]

export const shippingMethods = [
  {
    label: 'Ground',
    value: 'ground' as const,
    icon: Truck,
  },
  {
    label: 'Express',
    value: 'express' as const,
    icon: Plane,
  },
  {
    label: 'Freight',
    value: 'freight' as const,
    icon: Ship,
  },
]

