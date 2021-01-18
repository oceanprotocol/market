import { MetadataMarket, MetadataPublishForm } from '../@types/MetaData'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, (param) => `Title must be at least ${param.min} characters`)
    .required('Required'),
  description: Yup.string().required('Required').min(10),
  timeout: Yup.string().required('Required')
})

function mapTimoutSecondsToString(timeout: number) {
  switch (timeout) {
    case 0:
      return 'Forever'
    case 86400:
      return '1 day'
    case 604800:
      return '1 week'
    case 2630000:
      return '1 month'
    case 31556952:
      return '1 year'
    default:
      return 'Forever'
  }
}

export function getInitialValues(
  metadata: MetadataMarket,
  timeout: number
): Partial<MetadataPublishForm> {
  return {
    name: metadata.main.name,
    description: metadata.additionalInformation.description,
    timeout: mapTimoutSecondsToString(timeout)
  }
}
