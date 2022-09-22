import { Decimal } from 'decimal.js'

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

// Random number from interval
export function randomIntFromInterval(min: number, max: number): number {
  // min and max are included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function getMaxDecimalsValidation(max: number): RegExp {
  // eslint-disable-next-line security/detect-non-literal-regexp
  const maxDecimalsValidation = new RegExp('^\\d+(\\.\\d{1,' + max + '})?$')
  return maxDecimalsValidation
}
