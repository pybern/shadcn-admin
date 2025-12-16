import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(54321)

const carriers = ['fedex', 'ups', 'dhl', 'usps', 'amazon'] as const
const statuses = [
  'pending',
  'processing',
  'in transit',
  'out for delivery',
  'delivered',
  'failed',
  'returned',
  'exception',
] as const

const cities = [
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'Houston, TX',
  'Phoenix, AZ',
  'Philadelphia, PA',
  'San Antonio, TX',
  'San Diego, CA',
  'Dallas, TX',
  'San Jose, CA',
  'Austin, TX',
  'Jacksonville, FL',
  'Fort Worth, TX',
  'Columbus, OH',
  'Charlotte, NC',
  'Seattle, WA',
  'Denver, CO',
  'Boston, MA',
  'Nashville, TN',
  'Detroit, MI',
]

const generateTrackingNumber = (carrier: string) => {
  const prefixes: Record<string, string> = {
    fedex: 'FDX',
    ups: '1Z',
    dhl: 'DHL',
    usps: 'USPS',
    amazon: 'TBA',
  }
  const prefix = prefixes[carrier] || 'TRK'
  return `${prefix}${faker.string.alphanumeric({ length: 12 }).toUpperCase()}`
}

export const shipments = Array.from({ length: 100 }, () => {
  const carrier = faker.helpers.arrayElement(carriers)
  const status = faker.helpers.arrayElement(statuses)
  const origin = faker.helpers.arrayElement(cities)
  const destination = faker.helpers.arrayElement(
    cities.filter((city) => city !== origin)
  )

  return {
    id: `SHP-${faker.number.int({ min: 10000, max: 99999 })}`,
    trackingNumber: generateTrackingNumber(carrier),
    status,
    carrier,
    origin,
    destination,
    weight: faker.number.float({ min: 0.5, max: 150, fractionDigits: 2 }),
    estimatedDelivery: faker.date.future({ years: 0.1 }),
    createdAt: faker.date.past({ years: 0.5 }),
    customerName: faker.person.fullName(),
    customerEmail: faker.internet.email(),
    description: faker.commerce.productName(),
  }
})

