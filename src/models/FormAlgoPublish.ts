import { AlgorithmPublishForm } from '../@types/MetaData'
import { File as FileMetadata } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export const validationSchema: Yup.SchemaOf<AlgorithmPublishForm> = Yup.object()
  .shape({
    // ---- required fields ----
    name: Yup.string()
      .min(4, (param) => `Title must be at least ${param.min} characters`)
      .required('Required'),
    description: Yup.string().min(10).required('Required'),
    files: Yup.array<FileMetadata>().required('Required').nullable(),
    dockerImage: Yup.string()
      .matches(/NodeJS|Python 3.7/g, { excludeEmptyString: true })
      .required('Required'),
    author: Yup.string().required('Required'),
    termsAndConditions: Yup.boolean().required('Required'),
    // ---- optional fields ----
    algorithmPrivacy: Yup.boolean().nullable(),
    tags: Yup.string().nullable(),
    links: Yup.array<FileMetadata[]>().nullable()
  })
  .defined()

export const initialValues: Partial<AlgorithmPublishForm> = {
  name: '',
  author: '',
  dockerImage: '',
  files: '',
  description: '',
  algorithmPrivacy: false,
  termsAndConditions: false,
  tags: ''
}
