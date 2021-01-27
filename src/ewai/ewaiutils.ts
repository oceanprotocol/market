import { IEwaiAssetFormFields } from './client/ewai-js'

export function hasJsonStructure(str?: string): boolean {
  if (!str || str.length === 0) {
    return false
  }
  try {
    const result = JSON.parse(str)
    const type = Object.prototype.toString.call(result)
    return type === '[object Object]' || type === '[object Array]'
  } catch (err) {
    return false
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function safeJsonParse(str: string): any {
  try {
    return [null, JSON.parse(str)]
  } catch (err) {
    return [err]
  }
}

export function outputDataFormatToFileContentType(
  outputDataFormat: string
): string {
  switch (outputDataFormat.toLowerCase()) {
    case 'json':
      return 'application/json'
    case 'csv':
      return 'text/csv'
    case 'xml':
      return 'text/xml'
  }
  return 'application/json'
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function pickProps(obj: any, props: string[]): any {
  // Make sure object and properties are provided
  if (!obj || !props) {
    return undefined
  }
  // Create new object
  const picked: any = {}
  // Loop through props and push to new object
  props.forEach(function (prop) {
    picked[prop] = obj[prop]
  })
  return picked
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function transformPublishFormToEwaiAssetInfo(
  formValues: any
): IEwaiAssetFormFields {
  return pickProps(formValues, [
    'ewaiEwns',
    'ewaiCategory',
    'ewaiVendor',
    'ewaiPublishRole',
    'ewaiIncomingMsgFormat',
    'ewaiSchemaValidationOn',
    'ewaiMsgSchema',
    'ewaiPathToPtdTimestamp',
    'ewaiOutputFormat'
  ])
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export function transformEditFormToEwaiAssetInfo(
  formValues: any
): IEwaiAssetFormFields {
  return pickProps(formValues, [
    'ewaiCategory',
    'ewaiVendor',
    'ewaiPublishRole',
    'ewaiIncomingMsgFormat',
    'ewaiSchemaValidationOn',
    'ewaiMsgSchema',
    'ewaiPathToPtdTimestamp',
    'ewaiOutputFormat'
  ])
}

export function capitalize(
  str: string | null | undefined
): string | null | undefined {
  if (!str) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}
