import { MetadataMarket, MetadataPublishForm } from '../@types/MetaData'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape<
  Partial<MetadataPublishForm>
>({
  name: Yup.string().required('Required'),
  description: Yup.string().required('Required')
})

export function getInitialValues(
  metadata: MetadataMarket
): Partial<MetadataPublishForm> {
  return {
    name: metadata.main.name,
    description: metadata.additionalInformation.description
  }
}
