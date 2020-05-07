import BN from 'bn.js'

export enum Comparisson {
  'lt' = 'lt',
  'lte' = 'lte',
  'gt' = 'gt',
  'gte' = 'gte',
  'eq' = 'eq'
}

// Run the corresponding bn.js comparisson:
// https://github.com/indutny/bn.js/#utilities
export default function compareAsBN(
  a: string,
  b: string,
  comparisson: Comparisson
) {
  const aBN = new BN(a)
  const bBN = new BN(b)
  return aBN[comparisson](bBN)
}
