export function isValidNumber(value: any): number {
  const isUndefinedValue = typeof value === 'undefined'
  const isNullValue = value === null
  const isNaNValue = isNaN(Number(value))
  const isEmptyString = value === ''

  return !isUndefinedValue && !isNullValue && !isNaNValue && !isEmptyString
}
