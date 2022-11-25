import { isCID } from '@utils/ipfs'
import isUrl from 'is-url-superb'
import * as Yup from 'yup'

export function testLinks() {
  return Yup.string().test((value, context) => {
    const { type } = context.parent
    let validField
    let errorMessage

    switch (type) {
      case 'url':
        validField = isUrl(value?.toString() || '')
        if (!validField) {
          errorMessage = 'Must be a valid url.'
        } else {
          if (value?.toString().includes('drive.google')) {
            validField = false
            errorMessage =
              'Google Drive is not a supported hosting service. Please use an alternative.'
          }
        }
        break
      case 'ipfs':
        validField = isCID(value?.toString())
        errorMessage = !value?.toString() ? 'CID required.' : 'CID not valid.'
        break
      case 'arweave':
        validField = !value?.toString().includes('http')
        errorMessage = !value?.toString()
          ? 'Transaction ID required.'
          : 'Transaction ID not valid.'
        break
      case 'graphql':
        validField = value?.toString().length < 30
        errorMessage = !value?.toString() ? 'URL required.' : 'URL not valid.'
        break
      case 'smartcontract':
        validField = value?.toString().length < 30
        errorMessage = !value?.toString()
          ? 'Address required.'
          : 'Address not valid.'
        break
    }

    if (!validField) {
      return context.createError({
        message: errorMessage
      })
    }

    return true
  })
}
