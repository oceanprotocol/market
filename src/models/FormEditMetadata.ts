import { MetadataMarket, MetadataPublishForm } from '../@types/MetaData'
import { mapSecondsToTimeoutString } from '../utils/metadata'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, (param) => `Title must be at least ${param.min} characters`)
    .required('Required'),
  description: Yup.string().required('Required').min(10),
  timeout: Yup.string().required('Required')
})

export function getInitialValues(
  metadata: MetadataMarket,
  timeout: number
): Partial<MetadataPublishForm> {
  return {
    name: metadata.main.name,
    description: metadata.additionalInformation.description,
    timeout: mapSecondsToTimeoutString(timeout)
  }
}
