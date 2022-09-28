import { FileInfo } from '@oceanprotocol/lib'
import { validateFieldSchaclSchema } from '@utils/schaclSchema'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Required')
    .test(async (value, { path, createError }): Promise<any> => {
      if (!value) return
      const keyField = path.split('.')[0]
      const valueField = path.split('.')[1]

      return await validateFieldSchaclSchema(
        keyField,
        valueField,
        value,
        createError
      )
    }),
  description: Yup.string()
    .required('Required')
    .test(async (value, { path, createError }): Promise<any> => {
      if (!value) return
      const keyField = path.split('.')[0]
      const valueField = path.split('.')[1]

      return await validateFieldSchaclSchema(
        keyField,
        valueField,
        value,
        createError
      )
    }),
  price: Yup.number().required('Required'),
  files: Yup.array<FileInfo[]>()
    .of(
      Yup.object().shape({
        url: Yup.string().url('Must be a valid URL.'),
        valid: Yup.boolean().isTrue()
      })
    )
    .nullable(),
  links: Yup.array<FileInfo[]>()
    .of(
      Yup.object().shape({
        url: Yup.string().url('Must be a valid URL.'),
        valid: Yup.boolean().isTrue()
      })
    )
    .nullable(),
  timeout: Yup.string().required('Required'),
  author: Yup.string()
    .required('Required')
    .test(async (value, { path, createError }): Promise<any> => {
      if (!value) return
      const keyField = path.split('.')[0]
      const valueField = path.split('.')[1]

      return await validateFieldSchaclSchema(
        keyField,
        valueField,
        value,
        createError
      )
    })
})

export const computeSettingsValidationSchema = Yup.object().shape({
  allowAllPublishedAlgorithms: Yup.boolean().nullable(),
  publisherTrustedAlgorithms: Yup.array().nullable(),
  publisherTrustedAlgorithmPublishers: Yup.array().nullable()
})
