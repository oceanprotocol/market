import { Decimal } from 'decimal.js'

// Run decimal.js comparison
// http://mikemcl.github.io/decimal.js/#cmp
export default function compareAsBN(balance: string, price: string): boolean {
  console.log(balance, price)
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
