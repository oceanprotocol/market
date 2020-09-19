import { MetadataPublishForm } from '../@types/Metadata'
import { File as FileMetadata } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape<MetadataPublishForm>({
  // ---- required fields ----
  name: Yup.string().required('Required'),
  author: Yup.string().required('Required'),
  price: Yup.object().shape({
    price: Yup.number().required('Required'),
    tokensToMint: Yup.number().required('Required'),
    type: Yup.string()
      .matches(/fixed|dynamic/g)
      .required('Required'),
    weightOnDataToken: Yup.string().required('Required'),
    liquidityProviderFee: Yup.string()
      .length(3)
      .min(0.1)
      .max(0.9)
      .required('Required')
  }),
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
