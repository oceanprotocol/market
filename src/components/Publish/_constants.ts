import { File as FileMetadata } from '@oceanprotocol/lib'
import * as Yup from 'yup'
import { FormPublishData } from './_types'

export const validationSchema: Yup.SchemaOf<FormPublishData> = Yup.object()
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
    files: Yup.array<FileMetadata>()
      .required('Enter a valid URL and click "ADD FILE"')
      .nullable(),
    description: Yup.string().min(10).required('Required'),
    timeout: Yup.string().required('Required'),
    access: Yup.string()
      .matches(/Compute|Download/g, { excludeEmptyString: true })
      .required('Required'),
    termsAndConditions: Yup.boolean().required('Required'),
    // ---- optional fields ----
    tags: Yup.string().nullable(),
    links: Yup.array<FileMetadata[]>().nullable(),
    providerUri: Yup.string().url().nullable()
  })
  .defined()

export const initialValues: Partial<FormPublishData> = {
  // name: '',
  // author: '',
  // dataTokenOptions: {
  //   name: '',
  //   symbol: ''
  // },
  // files: '',
  // description: '',
  // timeout: 'Forever',
  // access: '',
  // termsAndConditions: false,
  // tags: '',
  // providerUri: ''
}

export const validationSchemaAlgo: Yup.SchemaOf<any> = Yup.object()
  .shape({
    // ---- required fields ----
    name: Yup.string()
      .min(4, (param) => `Title must be at least ${param.min} characters`)
      .required('Required'),
    description: Yup.string().min(10).required('Required'),
    files: Yup.array<FileMetadata>().required('Required').nullable(),
    timeout: Yup.string().required('Required'),
    dataTokenOptions: Yup.object()
      .shape({
        name: Yup.string(),
        symbol: Yup.string()
      })
      .required('Required'),
    dockerImage: Yup.string()
      .matches(/node:latest|python:latest|custom image/g, {
        excludeEmptyString: true
      })
      .required('Required'),
    image: Yup.string().required('Required'),
    containerTag: Yup.string().required('Required'),
    entrypoint: Yup.string().required('Required'),
    author: Yup.string().required('Required'),
    termsAndConditions: Yup.boolean().required('Required'),
    // ---- optional fields ----
    algorithmPrivacy: Yup.boolean().nullable(),
    tags: Yup.string().nullable(),
    links: Yup.array<FileMetadata[]>().nullable()
  })
  .defined()

export const initialValuesAlgo: Partial<any> = {
  name: '',
  author: '',
  dataTokenOptions: {
    name: '',
    symbol: ''
  },
  dockerImage: 'node:latest',
  image: 'node',
  containerTag: 'latest',
  entrypoint: 'node $ALGO',
  files: '',
  description: '',
  algorithmPrivacy: false,
  termsAndConditions: false,
  tags: '',
  timeout: 'Forever',
  providerUri: ''
}
