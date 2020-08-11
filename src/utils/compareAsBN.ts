import { Decimal } from 'decimal.js'

// Run decimal.js comparison
// http://mikemcl.github.io/decimal.js/#cmp
export default function compareAsBN(balance: string, price: string): boolean {
  const aBN = new Decimal(balance)
  const bBN = new Decimal(price)
  const compare = aBN.comparedTo(bBN)

  switch (compare) {
    case 1 || 0: // balance is greater or equal to price
      return true
    default:
      return false
  }
}
