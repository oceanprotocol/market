import { MetadataEditForm, MetadataMarket } from '../@types/MetaData'
import { secondsToString } from '../utils/metadata'
import { EditableMetadataLinks } from '@oceanprotocol/lib'
import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, (param) => `Title must be at least ${param.min} characters`)
    .required('Required'),
  description: Yup.string().required('Required').min(10),
  links: Yup.array<EditableMetadataLinks[]>().nullable(),
  timeout: Yup.string().required('Required'),
  isDatasetConsumable: Yup.array().nullable()
})

export function getInitialValues(
  metadata: MetadataMarket,
  timeout: number,
  isDatasetConsumable: boolean
): Partial<MetadataEditForm> {
  return {
    name: metadata.main.name,
    description: metadata.additionalInformation.description,
    links: metadata.additionalInformation.links,
    timeout: secondsToString(timeout),
    isDatasetConsumable: isDatasetConsumable
  }
}
