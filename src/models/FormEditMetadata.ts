import { MetadataPublishForm } from '../@types/MetaData'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape<
  Partial<MetadataPublishForm>
>({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required')
})
