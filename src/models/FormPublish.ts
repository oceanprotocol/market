import { MetadataPublishForm } from '../@types/MetaData'
import { File as FileMetadata } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape<MetadataPublishForm>({
  // ---- required fields ----
  name: Yup.string().required('Required'),
  author: Yup.string().required('Required'),
  price: Yup.object()
    .shape({
      price: Yup.number().min(1, 'Must be greater than 0').required('Required'),
      tokensToMint: Yup.number()
        .min(1, 'Must be greater than 0')
        .required('Required'),
      type: Yup.string()
        .matches(/fixed|dynamic/g)
        .required('Required'),
      weightOnDataToken: Yup.string().required('Required'),
      swapFee: Yup.number()
        .min(0.1, 'Must be more or equal to 0.1')
        .max(0.9, 'Must be less or equal to 0.9')
        .required('Required'),
      datatoken: Yup.object()
        .shape({
          name: Yup.string(),
          symbol: Yup.string()
        })
        .nullable()
    })
    .required('Required'),
  files: Yup.array<FileMetadata>().required('Required').nullable(),
  description: Yup.string().required('Required'),
  license: Yup.string().required('Required'),
  access: Yup.string()
    .matches(/Compute|Download/g)
    .required('Required'),
  termsAndConditions: Yup.boolean().required('Required'),

  // ---- optional fields ----
  copyrightHolder: Yup.string().nullable(),
  tags: Yup.string().nullable(),
  links: Yup.object<FileMetadata[]>().nullable()
})

export const initialValues: Partial<MetadataPublishForm> = {
  name: '',
  author: '',
  price: {
    price: 1,
    type: 'fixed',
    tokensToMint: 1,
    weightOnDataToken: '9', // 90% on data token
    swapFee: 0.1 // in %
  },
  files: '',
  description: '',
  license: '',
  access: '',
  termsAndConditions: false
}
