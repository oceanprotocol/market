import { MetadataPublishForm, Timeout } from '../@types/MetaData'
import { File as FileMetadata } from '@oceanprotocol/lib'
import * as Yup from 'yup'

const timecheck = Yup.number()
  .min(0)
  .nullable()
  .transform((v) => (v === '' ? null : v))

const timeoutValidationSchema = {
  years: timecheck,
  months: timecheck,
  days: timecheck,
  hours: timecheck,
  minutes: timecheck,
  seconds: timecheck
}

export const validationSchema = Yup.object().shape<MetadataPublishForm>({
  // ---- required fields ----
  name: Yup.string().required('Required'),
  author: Yup.string().required('Required'),
  dataTokenOptions: Yup.object()
    .shape({
      name: Yup.string(),
      symbol: Yup.string()
    })
    .required('Required'),
  files: Yup.array<FileMetadata>().required('Required').nullable(),
  description: Yup.string().required('Required'),
  access: Yup.string()
    .matches(/Compute|Download/g)
    .required('Required'),
  termsAndConditions: Yup.boolean().required('Required'),

  // ---- optional fields ----
  tags: Yup.string().nullable(),
  links: Yup.object<FileMetadata[]>().nullable(),
  providerUri: Yup.string().nullable(),
  accessTimeout: Yup.object<Timeout>()
    .shape<Timeout>(timeoutValidationSchema)
    .nullable(),
  computeTimeout: Yup.object<Timeout>()
    .shape<Timeout>(timeoutValidationSchema)
    .nullable()
})

const defaultTimeout: Timeout = {
  years: '',
  months: '',
  days: '',
  hours: '',
  minutes: '',
  seconds: ''
}

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
  termsAndConditions: false,
  accessTimeout: defaultTimeout,
  computeTimeout: defaultTimeout
}
