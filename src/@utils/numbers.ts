import { Decimal } from 'decimal.js'

export function isValidNumber(value: any): boolean {
  const isUndefinedValue = typeof value === 'undefined'
  const isNullValue = value === null
  const isNaNValue = isNaN(Number(value))
  const isEmptyString = value === ''

  return !isUndefinedValue && !isNullValue && !isNaNValue && !isEmptyString
}

// Run decimal.js comparison
// http://mikemcl.github.io/decimal.js/#cmp
export function compareAsBN(balance: string, price: string): boolean {
  const aBN = new Decimal(balance)
  const bBN = new Decimal(price)
  const compare = aBN.comparedTo(bBN)

  switch (compare) {
    case 1: // balance is greater than price
    case 0: // balance is equal to price
      return true
    default:
      return false
  }
}
