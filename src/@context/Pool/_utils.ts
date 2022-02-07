import { isValidNumber } from '@utils/numbers'
import Decimal from 'decimal.js'

export function getWeight(weight: string) {
  return isValidNumber(weight) ? new Decimal(weight).mul(10).toString() : '0'
}

export function getFee(fee: string) {
  // fees are tricky: to get 0.1% you need to convert from 0.001
  return isValidNumber(fee) ? new Decimal(fee).mul(100).toString() : '0'
}
