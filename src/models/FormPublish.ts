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
    timeout: Yup.string().required('Required'),
    access: Yup.string()
      .matches(/Compute|Download/g, { excludeEmptyString: true })
      .required('Required'),
    termsAndConditions: Yup.boolean().required('Required'),

    // ---- optional fields ----
    tags: Yup.string().nullable(),
    links: Yup.array<FileMetadata[]>().nullable(),
    providerUri: Yup.lazy((value) =>
      /^data/.test(value)
        ? Yup.string()
            .trim()
            .matches(
              /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@/?%\s]*)$/i,
              'Must be a valid data URI'
            )
        : Yup.string().trim().url('Must be a valid URL')
    )
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
  providerUri: '',
  timeout: 'Forever',
  access: '',
  termsAndConditions: false,
  tags: ''
}
