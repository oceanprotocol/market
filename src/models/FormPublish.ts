import { MetadataPublishForm } from '../@types/MetaData'
import { File as FileMetadata } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export const validationSchema: Yup.SchemaOf<MetadataPublishForm> = Yup.object()
  .shape({
    // ---- required fields ----
    name: Yup.string()
      .min(4, (param) => `Title must be at least ${param.min} characters`)
      .required('Required'),
    author: Yup.string().required('Required'),
    dataTokenOptions: Yup.object()
      .shape({
        name: Yup.string(),
        symbol: Yup.string()
      })
      .required('Required'),
    files: Yup.array<FileMetadata>().required('Required').nullable(),
    description: Yup.string().min(10).required('Required'),
    access: Yup.string()
      .matches(/Compute|Download/g, { excludeEmptyString: true })
      .required('Required'),
    termsAndConditions: Yup.boolean().required('Required'),

    // ---- optional fields ----
    tags: Yup.string().nullable(),
    links: Yup.array<FileMetadata[]>().nullable()
  })
  .defined()

export const initialValues: Partial<MetadataPublishForm> = {
  name: '',
  author: '',
  dataTokenOptions: {
    name: '',
    symbol: ''
  },
  files: '',
  description: '',
  access: '',
  termsAndConditions: false
}
