import * as Yup from 'yup'
import { AccessType } from '../@types/MetaData'
import { File } from '@oceanprotocol/squid'

export interface PublishFormData {
  // ---- required fields ----
  name: string
  description: string
  files: File[]
  termsAndConditions: boolean
  author: string
  license: string
  price: number
  access?: AccessType
  // ---- optional fields ----
  dateRange?: string
  copyrightHolder?: string
  tags?: string
}

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  author: Yup.string().required('Required'),
  price: Yup.string().required('Required'),
  files: Yup.array().required('Required'),
  summary: Yup.string().required('Required'),
  license: Yup.string().required('Required'),
  termsAndConditions: Yup.boolean().required('Required'),
  dateRange: Yup.string().required('Required'),
  copyrightHolder: Yup.string().required('Required'),
  tags: Yup.string().required('Required')
})

export const initialValues: PublishFormData = {
  author: '',
  price: 0,
  name: '',
  files: [],
  description: '',
  license: '',
  termsAndConditions: false,
  dateRange: undefined,
  copyrightHolder: undefined,
  tags: undefined
}
