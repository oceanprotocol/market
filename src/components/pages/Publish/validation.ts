import { MetadataPublishForm } from '../../../@types/Metadata'
import { File as FileMetadata } from '@oceanprotocol/lib/dist/node/ddo/interfaces/File'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape<MetadataPublishForm>({
  // ---- required fields ----
  name: Yup.string().required('Required'),
  author: Yup.string().required('Required'),
  cost: Yup.string().required('Required'),
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
  cost: undefined,
  files: undefined,
  description: undefined,
  license: undefined,
  access: undefined,
  termsAndConditions: undefined,
  copyrightHolder: undefined,
  tags: undefined,
  links: undefined
}
