import { MetadataPublishForm } from '../@types/Metadata'
import { File as FileMetadata } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape<MetadataPublishForm>({
  // ---- required fields ----
  name: Yup.string().required('Required'),
  author: Yup.string().required('Required'),
  price: Yup.object().shape({
    tokensToMint: Yup.number().required('Required'),
    type: Yup.string()
      .matches(/simple|advanced/g)
      .required('Required'),
    weight: Yup.string().required('Required'),
    ownerFee: Yup.string()
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
  links: Yup.object<FileMetadata[]>()
})

export const initialValues: MetadataPublishForm = {
  name: undefined,
  author: undefined,
  price: {
    type: 'simple',
    tokensToMint: 1,
    weight: '9', // 90% on data token
    ownerFee: '0.03' // in %
  },
  files: undefined,
  description: undefined,
  license: undefined,
  access: undefined,
  termsAndConditions: false,
  copyrightHolder: undefined,
  tags: undefined,
  links: undefined
}
