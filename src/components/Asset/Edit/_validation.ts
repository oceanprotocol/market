import { FileInfo } from '@oceanprotocol/lib'
import { isCID } from '@utils/ipfs'
import isUrl from 'is-url-superb'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, (param) => `Title must be at least ${param.min} characters`)
    .required('Required'),
  description: Yup.string().required('Required').min(10),
  price: Yup.number().required('Required'),
  files: Yup.array<FileInfo[]>()
    .of(
      Yup.object().shape({
        url: Yup.string().test((value, context) => {
          const { type } = context.parent

          // allow user to submit if the value type is hidden
          if (type === 'hidden') return true

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
              errorMessage = !value?.toString()
                ? 'CID required.'
                : 'CID not valid.'
              break
            case 'arweave':
              validField = value?.toString().length < 30
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
        }),
        valid: Yup.boolean().test((value, context) => {
          const { type } = context.parent

          // allow user to submit if the value type is hidden
          if (type === 'hidden') return true

          return value || false
        })
      })
    )
    .nullable(),
  links: Yup.array<FileInfo[]>().of(
    Yup.object().shape({
      url: Yup.string().test((value, context) => {
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
        }

        if (value && !validField) {
          return context.createError({
            message: errorMessage
          })
        }

        return true
      }),
      valid: Yup.boolean().test((value, context) => {
        // allow user to submit if the value is null
        const { valid, url } = context.parent

        // allow user to continue if the file is empty
        if (!url) return true

        return valid
      })
    })
  ),
  timeout: Yup.string().required('Required'),
  author: Yup.string().nullable(),
  tags: Yup.array<string[]>().nullable()
})

export const computeSettingsValidationSchema = Yup.object().shape({
  allowAllPublishedAlgorithms: Yup.boolean().nullable(),
  publisherTrustedAlgorithms: Yup.array().nullable(),
  publisherTrustedAlgorithmPublishers: Yup.array().nullable()
})
