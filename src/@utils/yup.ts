import { isCID } from '@utils/ipfs'
import isUrl from 'is-url-superb'
import * as Yup from 'yup'
import { isGoogleUrl } from './url/index'

export function testLinks(isEdit?: boolean) {
  return Yup.string().test((value, context) => {
    const { type } = context.parent
    let validField
    let errorMessage

    switch (type) {
      // we allow submit if the type input is hidden as will be ignore
      case 'hidden':
        validField = true
        break
      case 'url':
        validField = isUrl(value?.toString() || '')
        // if we're in publish, the field must be valid
        if (!validField) {
          validField = false
          errorMessage = 'Must be a valid url.'
        }
        // we allow submit if we're in the edit page and the field is empty
        if (
          (!value?.toString() && isEdit) ||
          (!value?.toString() && context.path === 'services[0].links[0].url')
        ) {
          validField = true
        }
        // if the url has google drive, we need to block the user from submit
        if (isGoogleUrl(value?.toString())) {
          validField = false
          errorMessage =
            'Google Drive is not a supported hosting service. Please use an alternative.'
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
    }

    if (!validField) {
      return context.createError({
        message: errorMessage
      })
    }

    return true
  })
}
