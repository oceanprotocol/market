import BN from 'bn.js'

export enum Comparison {
  'lt' = 'lt',
  'lte' = 'lte',
  'gt' = 'gt',
  'gte' = 'gte',
  'eq' = 'eq'
}

// Run the corresponding bn.js comparison:
// https://github.com/indutny/bn.js/#utilities
export default function compareAsBN(
  a: string,
  b: string,
  comparison: Comparison
): boolean {
  const aBN = new BN(a)
  const bBN = new BN(b)
  return aBN[comparison](bBN)
}
