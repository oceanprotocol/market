import { DataTokenOptions } from '@hooks/usePublish'
import { EditableMetadataLinks } from '@oceanprotocol/lib'

export interface FormPublishService {
  timeout: string
  dataTokenOptions: DataTokenOptions
  access: 'Download' | 'Compute' | string
}

export interface FormPublishData {
  type: 'dataset' | 'algorithm'
  metadata: {
    name: string
    description: string
    files: string | File[]
    author: string
    termsAndConditions: boolean
    tags?: string
    links?: string | EditableMetadataLinks[]
    providerUri?: string
  }
  services: FormPublishService[]
  pricing: PriceOptions
}
