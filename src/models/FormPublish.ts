import { MetadataPublishForm } from '../@types/Metadata'
import { File as FileMetadata } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape<MetadataPublishForm>({
  // ---- required fields ----
  name: Yup.string().required('Required'),
  author: Yup.string().required('Required'),
  price: Yup.object()
    .shape({
      price: Yup.number()
        .min(1, 'Must be greater than 0')
        .positive()
        .required('Required'),
      tokensToMint: Yup.number().positive().required('Required'),
      type: Yup.string()
        .matches(/fixed|dynamic/g)
        .required('Required'),
      weightOnDataToken: Yup.string().required('Required'),
      liquidityProviderFee: Yup.string()
        .matches(/0.[0-9]/, 'Only values between 0.1 - 0.9 are allowed')
        .required('Required')
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
  copyrightHolder: Yup.string(),
  tags: Yup.string(),
  links: Yup.object<FileMetadata[]>().nullable()
})

export const initialValues: MetadataPublishForm = {
  name: '',
  author: '',
  price: {
    price: 1,
    type: 'fixed',
    tokensToMint: 1,
    weightOnDataToken: '9', // 90% on data token
    liquidityProviderFee: '0.1', // in %
    price: 1
  },
  files: '',
  description: '',
  license: '',
  access: '',
  termsAndConditions: false,
  copyrightHolder: '',
  tags: '',
  links: ''
}
