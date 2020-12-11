import { MetadataMarket, MetadataPublishForm } from '../@types/MetaData'
import * as Yup from 'yup'

export const validationSchema: Yup.SchemaOf<Partial<
  MetadataPublishForm
>> = Yup.object().shape({
  name: Yup.string()
    .min(4, (param) => `Title must be at least ${param.min} characters`)
    .required('Required'),
  description: Yup.string().required('Required').min(10)
})

export function getInitialValues(
  metadata: MetadataMarket
): Partial<MetadataPublishForm> {
  return {
    name: metadata.main.name,
    description: metadata.additionalInformation.description
  }
}
